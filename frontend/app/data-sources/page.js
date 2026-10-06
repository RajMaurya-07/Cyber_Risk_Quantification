'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Radio, ShieldCheck, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Plug } from 'lucide-react';
import { uploadDataset } from '../../lib/api/ingestion';
import apiClient from '../../lib/api/client';

const REQUIRED_DATASETS = [
  { file: 'assets.csv', label: 'Asset inventory', description: 'Asset IDs, names, types, service IDs, and criticality.' },
  { file: 'vulnerabilities.csv', label: 'Vulnerability findings', description: 'Vulnerability IDs, asset IDs, CVEs, CVSS, and patch information.' },
  { file: 'asset_relationships.csv', label: 'Asset relationships', description: 'Source and destination asset IDs and relationship types for attack paths.' },
  { file: 'business_services.csv', label: 'Business services', description: 'Service IDs, business units, revenue dependency, and downtime cost.' },
  { file: 'threat_scenarios.csv', label: 'Threat scenarios', description: 'Threat IDs, attack vectors, and annual frequency estimates.' },
  { file: 'threat_asset_impacts.csv', label: 'Threat impact estimates', description: 'Threat/asset-type impacts, low/likely/high values, and units.' },
  { file: 'controls.csv', label: 'Security controls', description: 'Control IDs, names, categories, and implementation costs.' },
  { file: 'control_status.csv', label: 'Control deployment status', description: 'Control and asset IDs, status, coverage, and maturity.' },
  { file: 'control_effectiveness.csv', label: 'Control effectiveness', description: 'Control/threat IDs and low/base/high effectiveness estimates.' },
];

const OPTIONAL_DATASETS = [
  { file: 'asset_type_mapping.csv', label: 'Asset type mappings' },
  { file: 'business_units.csv', label: 'Business units' },
  { file: 'relationship_weights.csv', label: 'Relationship weights' },
  { file: 'vulnerability_threat_rules.csv', label: 'Vulnerability-to-threat rules' },
];

function extensionOf(filename) {
  if (filename.toLowerCase().endsWith('.xlsx')) return '.xlsx';
  if (filename.toLowerCase().endsWith('.csv')) return '.csv';
  return null;
}

export default function DataSourcesPage() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [selectedMode, setSelectedMode] = useState('unconfigured');
  const [sourceMessage, setSourceMessage] = useState('Checking active calculation source…');
  const [isChangingSource, setIsChangingSource] = useState(false);
  const [isSiemFormOpen, setIsSiemFormOpen] = useState(false);
  const [siemName, setSiemName] = useState('SIEM / EDR');
  const [siemEndpoint, setSiemEndpoint] = useState('');
  const [siemConnected, setSiemConnected] = useState(false);

  const selectedCount = REQUIRED_DATASETS.filter(({ file }) => selectedFiles[file]).length;
  const canUpload = selectedCount === REQUIRED_DATASETS.length && !isUploading;

  useEffect(() => {
    let isCurrent = true;
    apiClient.get('/data-sources/status')
      .then((result) => {
        if (!isCurrent) return;
        const activeMode = result.active_mode || 'unconfigured';
        setSelectedMode(activeMode);
        setSourceMessage(
          result.calculations_enabled
            ? `Customer calculation source active: ${activeMode}`
            : 'No customer data source is active. Upload a complete dataset to enable calculations.'
        );
      })
      .catch((error) => {
        if (isCurrent) setSourceMessage(`Unable to check active source: ${error.message}`);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  function selectFile(fileName, selectedFile) {
    setSelectedFiles((current) => ({ ...current, [fileName]: selectedFile || null }));
    setUploadResult(null);
    setUploadError('');
  }

  async function handleUpload() {
    if (!canUpload) return;
    setIsUploading(true);
    setUploadError('');
    setUploadResult(null);

    const formData = new FormData();
    for (const { file } of REQUIRED_DATASETS) {
      const selectedFile = selectedFiles[file];
      const extension = extensionOf(selectedFile.name);
      if (!extension) {
        setUploadError(`${file} must be uploaded as .csv or .xlsx.`);
        setIsUploading(false);
        return;
      }
      formData.append('files', selectedFile, `${file.replace(/\.csv$/i, '')}${extension}`);
    }
    for (const { file } of OPTIONAL_DATASETS) {
      const selectedFile = selectedFiles[file];
      if (selectedFile) {
        const extension = extensionOf(selectedFile.name);
        if (!extension) {
          setUploadError(`${file} must be uploaded as .csv or .xlsx.`);
          setIsUploading(false);
          return;
        }
        formData.append('files', selectedFile, `${file.replace(/\.csv$/i, '')}${extension}`);
      }
    }

    try {
      const result = await uploadDataset(formData);
      setUploadResult(result);
      if (result.ingestion_status !== 'ready') {
        setUploadError(`Dataset is incomplete. Missing: ${(result.missing_required || []).join(', ')}`);
      } else {
        setSelectedMode('uploaded');
        setSourceMessage(`Current calculation source: uploaded dataset ${result.dataset_id}`);
        router.push('/dashboard');
      }
    } catch (error) {
      setUploadError(error.message || 'Upload failed. Check that the backend is available and try again.');
    } finally {
      setIsUploading(false);
    }
  }

  async function activateSource(mode) {
    setIsChangingSource(true);
    setUploadError('');
    try {
      await apiClient.post('/data-sources/run', { mode });
      setSelectedMode(mode);
      setSourceMessage(
        mode === 'uploaded'
          ? 'Current calculation source: uploaded customer dataset'
          : `Current calculation source: ${mode}`
      );
    } catch (error) {
      setSourceMessage(`Unable to activate ${mode}: ${error.message}`);
    } finally {
      setIsChangingSource(false);
    }
  }

  function handleSiemConnect(event) {
    event.preventDefault();
    setSiemConnected(true);
    setIsSiemFormOpen(false);
  }

  return (
    <PageContainer
      title="Data Sources"
      subtitle="Upload the organization-specific data used by the risk calculations."
    >
      <div className="space-y-6">

        <Card
          title="Upload a customer dataset"
          subtitle="Provide one CSV or Excel workbook for each required dataset. Uploading a complete set activates it for the risk calculation APIs."
          headerAction={
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-800 bg-cyan-950/60 px-3 py-1 text-[11px] font-semibold text-cyan-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              {selectedCount}/{REQUIRED_DATASETS.length} files selected
            </span>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {REQUIRED_DATASETS.map((dataset) => {
              const selectedFile = selectedFiles[dataset.file];
              const inputId = `upload-${dataset.file}`;
              return (
                <div key={dataset.file} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg border border-cyan-800 bg-cyan-950/70 p-2 text-cyan-300">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor={inputId} className="cursor-pointer text-sm font-semibold text-white">
                        {dataset.label}
                      </label>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{dataset.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <input
                      id={inputId}
                      type="file"
                      accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      className="block w-full cursor-pointer text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-950 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-cyan-200 hover:file:bg-cyan-900"
                      onChange={(event) => selectFile(dataset.file, event.target.files?.[0])}
                    />
                    <p className="mt-2 truncate font-mono text-[10px] text-slate-500">
                      {selectedFile ? `${selectedFile.name} → ${dataset.file}` : `Expected name: ${dataset.file}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs leading-5 text-slate-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              CSV and .xlsx files are supported (maximum 50 MB per file). Excel uploads use the first worksheet.
            </div>
            <Button variant="primary" size="md" onClick={handleUpload} disabled={!canUpload} className="gap-2">
              <UploadCloud className="h-4 w-4" />
              {isUploading ? 'Uploading dataset…' : 'Upload and activate'}
            </Button>
          </div>

          {uploadError && (
            <p role="alert" className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
              {uploadError}
            </p>
          )}
          {uploadResult?.ingestion_status === 'ready' && (
            <div role="status" className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Dataset {uploadResult.dataset_id} uploaded and activated. Risk calculations will now use this dataset.
              </span>
            </div>
          )}
        </Card>

        <Card
          title="Optional supporting datasets"
          subtitle="Supplemental tables for vulnerability mapping, asset categorization, and attack-path weighting."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OPTIONAL_DATASETS.map(({ file, label }) => (
              <label key={file} htmlFor={`optional-${file}`} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-sm font-semibold text-white">
                {label}
                <input
                  id={`optional-${file}`}
                  type="file"
                  accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="mt-3 block w-full cursor-pointer text-xs text-slate-300 file:mr-2 file:rounded-lg file:border-0 file:bg-cyan-950 file:px-2 file:py-1.5 file:text-[10px] file:font-semibold file:text-cyan-200"
                  onChange={(event) => selectFile(file, event.target.files?.[0])}
                />
                <span className="mt-2 block truncate font-mono text-[10px] font-normal text-slate-500">
                  {selectedFiles[file]?.name || file}
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card
          title="Live SIEM / EDR telemetry"
          subtitle="Keep SIEM as an optional live source for alert and endpoint telemetry."
          headerAction={
            <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] font-semibold text-slate-300">
              OPTIONAL CONNECTOR
            </span>
          }
        >
          <div className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-cyan-800 bg-cyan-950/70 p-2 text-cyan-300">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Splunk, Microsoft Sentinel, CrowdStrike, or other SIEM/EDR</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Configure a telemetry endpoint separately from the batch dataset used for baseline calculations.
                </p>
                {siemConnected && (
                  <p className="mt-2 text-xs text-emerald-300">
                    {siemName} endpoint saved for this session; live ingestion still requires a backend connector.
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="md" onClick={() => setIsSiemFormOpen((open) => !open)} className="gap-2">
              <Plug className="h-4 w-4" />
              {isSiemFormOpen ? 'Close setup' : 'Configure SIEM'}
            </Button>
          </div>

          {isSiemFormOpen && (
            <form onSubmit={handleSiemConnect} className="mt-4 grid gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-4 md:grid-cols-[1fr_2fr_auto]">
              <label className="text-xs font-medium text-slate-300">
                Source name
                <input
                  value={siemName}
                  onChange={(event) => setSiemName(event.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                />
              </label>
              <label className="text-xs font-medium text-slate-300">
                Webhook / API endpoint
                <input
                  type="url"
                  value={siemEndpoint}
                  onChange={(event) => setSiemEndpoint(event.target.value)}
                  required
                  placeholder="https://..."
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                />
              </label>
              <div className="flex items-end">
                <Button type="submit" variant="primary" size="md">Save connector</Button>
              </div>
            </form>
          )}
        </Card>

        <p className="text-xs leading-5 text-slate-500">
          Datasets are stored by the backend and become active for subsequent calculations when all required inputs are present.
        </p>
      </div>
    </PageContainer>
  );
}
