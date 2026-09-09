import itertools
import logging
from typing import List, Dict, Any, Optional
import networkx as nx
from app.services.attack_graph.graph_builder import get_entry_points, get_critical_targets

logger = logging.getLogger(__name__)


def find_attack_paths(
    graph: nx.DiGraph,
    entry_point_ids: Optional[List[str]] = None,
    target_asset_ids: Optional[List[str]] = None,
    max_path_length: int = 5,
    max_paths_per_pair: int = 50,
) -> List[List[str]]:
    if not entry_point_ids:
        entry_points = get_entry_points(graph)
        entry_point_ids = [ep["asset_id"] for ep in entry_points]

    if not target_asset_ids:
        targets = get_critical_targets(graph, min_criticality=8)
        target_asset_ids = [t["asset_id"] for t in targets]

    paths: List[List[str]] = []
    seen_paths = set()

    for src in entry_point_ids:
        if src not in graph:
            continue
        for tgt in target_asset_ids:
            if tgt not in graph or src == tgt:
                continue
            if not nx.has_path(graph, src, tgt):
                continue

            try:
                count = 0
                for path in nx.all_simple_paths(graph, source=src, target=tgt, cutoff=max_path_length):
                    if count >= max_paths_per_pair:
                        logger.warning(
                            f"Path cap of {max_paths_per_pair} hit for entry '{src}' -> "
                            f"target '{tgt}'; additional simple paths were not enumerated."
                        )
                        break
                    path_tuple = tuple(path)
                    if path_tuple not in seen_paths:
                        seen_paths.add(path_tuple)
                        paths.append(list(path))
                    count += 1
            except nx.NetworkXNoPath:
                continue
            except Exception as e:
                logger.error(f"Error traversing path {src} -> {tgt}: {str(e)}")
                continue

    return paths


class PathFinderService:
    def __init__(self, max_path_length: int = 5):
        self.max_path_length = max_path_length

    def execute(self, graph: nx.DiGraph, *args, **kwargs) -> List[List[str]]:
        return find_attack_paths(graph, max_path_length=self.max_path_length)
