# tests/test_attack_graph.py

import os
import pytest
import networkx as nx
from fastapi.testclient import TestClient

from app.main import app
from app.services.attack_graph.graph_builder import (
    build_attack_graph,
    get_entry_points,
    get_critical_targets,
)
from app.services.attack_graph.path_finder import find_attack_paths
from app.services.attack_graph.risk_paths import rank_attack_paths

client = TestClient(app)


def test_build_attack_graph():
    """Verify NetworkX DiGraph creation, node/edge counts, and attribute attachments."""
    graph = build_attack_graph()

    assert isinstance(graph, nx.DiGraph)
    assert graph.number_of_nodes() > 50, "Expected at least 50 asset nodes from dataset"
    assert graph.number_of_edges() > 50, "Expected at least 50 relationship edges from dataset"

    # Check random node attributes
    node_id = list(graph.nodes)[0]
    data = graph.nodes[node_id]
    assert "criticality" in data
    assert "internet_exposed" in data
    assert "vulnerabilities" in data
    assert "max_cvss" in data


def test_invalid_asset_references():
    """Verify that graph builder avoids adding ghost/invalid nodes from missing references."""
    graph = build_attack_graph()
    # Every node in the graph must have been created from assets dataset with 'name' attribute
    for node_id, data in graph.nodes(data=True):
        assert "name" in data, f"Node {node_id} missing attributes, likely created implicitly"


def test_entry_points_detection():
    """Verify get_entry_points accurately filters internet-exposed assets."""
    graph = build_attack_graph()
    entry_points = get_entry_points(graph)

    assert len(entry_points) > 0, "Should discover at least 1 internet-exposed entry point"
    for ep in entry_points:
        node_data = graph.nodes[ep["asset_id"]]
        assert node_data["internet_exposed"] is True


def test_critical_targets_detection():
    """Verify get_critical_targets accurately filters high-criticality assets."""
    graph = build_attack_graph()
    targets = get_critical_targets(graph, min_criticality=8)

    assert len(targets) > 0, "Should discover critical targets with criticality >= 8"
    for tgt in targets:
        assert tgt["criticality"] >= 8 or tgt["data_sensitivity"] == "High"


def test_path_discovery_and_ranking():
    """Verify path finder and risk paths ranker pipeline."""
    graph = build_attack_graph()
    entry_points = get_entry_points(graph)
    targets = get_critical_targets(graph, min_criticality=8)

    ep_ids = [ep["asset_id"] for ep in entry_points]
    tgt_ids = [t["asset_id"] for t in targets]

    max_len = 5
    raw_paths = find_attack_paths(
        graph,
        entry_point_ids=ep_ids,
        target_asset_ids=tgt_ids,
        max_path_length=max_len,
    )

    assert len(raw_paths) > 0, "Path finder should discover at least 1 attack path"

    # Test path length constraint
    for path in raw_paths:
        path_length = len(path) - 1
        assert path_length <= max_len

    # Test path ranking
    ranked_paths = rank_attack_paths(graph, raw_paths)
    assert len(ranked_paths) == len(raw_paths)

    # Test sorting (descending score)
    prev_score = 1.0
    for p in ranked_paths:
        assert 0.0 <= p["score"] <= 1.0
        assert p["score"] <= prev_score + 1e-6
        prev_score = p["score"]
        assert "path_id" in p
        assert "source_asset" in p
        assert "target_asset" in p
        assert "asset_path" in p


def test_fastapi_attack_paths_endpoint():
    """Verify FastAPI /api/v1/attack-paths endpoint response."""
    response = client.get("/api/v1/attack-paths?max_path_length=4&min_criticality=8")
    assert response.status_code == 200

    data = response.json()
    assert "summary" in data
    assert "nodes" in data
    assert "edges" in data
    assert "entry_points" in data
    assert "target_assets" in data
    assert "critical_paths" in data

    assert data["summary"]["total_nodes"] > 0
    assert data["summary"]["total_edges"] > 0
    assert len(data["critical_paths"]) > 0


def test_fastapi_attack_graph_topology_endpoint():
    """Verify FastAPI /api/v1/attack-paths/graph topology endpoint."""
    response = client.get("/api/v1/attack-paths/graph")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "success"
    assert data["nodes_count"] > 0
    assert data["edges_count"] > 0
