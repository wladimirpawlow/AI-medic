import CalculationsTable, { type Calculation } from '../ui/CalculationsTable'

const CalculationsPage = () => {
  const mockData: Calculation[] = [
    {
      runId: 'run-0001',
      setName: 'Набор осмотров Q1',
      setVersion: 2,
      algorithm: 'v1.2.0',
      calculatedAt: '2026-02-17T14:30:00',
      fileName: 'расчет_run-0001_20260217.xlsx',
      downloadUrl: '#',
    },
    {
      runId: 'run-0002',
      setName: 'Пилотный набор',
      setVersion: 1,
      algorithm: 'v1.1.0',
      calculatedAt: '2026-02-16T11:00:00',
      fileName: 'расчет_run-0002_20260216.xlsx',
      downloadUrl: '#',
    },
  ]

  return (
    <div className="page-card">
      <CalculationsTable data={mockData} />
    </div>
  )
}

export default CalculationsPage
