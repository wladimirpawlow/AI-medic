import RunsTable, { type Run } from '../ui/RunsTable'

const RunsPage = () => {
  const mockData: Run[] = [
    {
      id: 'run-0001',
      savVersionId: 'sav-1.0.0',
      setId: 'set-0001',
      setVersion: 3,
      inspectionId: undefined,
      startedAt: '2026-02-17T10:00:00',
      completedAt: '2026-02-17T10:15:00',
      status: 'завершен успешно',
      processedCount: 120,
      totalCount: 120,
      initiator: 'expert01',
    },
    {
      id: 'run-0002',
      savVersionId: 'sav-1.1.0',
      setId: 'set-0002',
      setVersion: 1,
      inspectionId: 'inspection-0005',
      startedAt: '2026-02-17T11:00:00',
      completedAt: undefined,
      status: 'обработка',
      processedCount: 5,
      totalCount: 20,
      initiator: 'admin',
    },
    {
      id: 'run-0003',
      savVersionId: 'sav-1.0.0',
      setId: 'set-0003',
      setVersion: 2,
      inspectionId: undefined,
      startedAt: '2026-02-16T09:30:00',
      completedAt: undefined,
      status: 'в очереди',
      processedCount: 0,
      totalCount: 45,
      initiator: 'user01',
    },
    {
      id: 'run-0004',
      savVersionId: 'sav-1.0.1',
      setId: 'set-0004',
      setVersion: 1,
      inspectionId: undefined,
      startedAt: '2026-02-15T08:30:00',
      completedAt: '2026-02-15T09:10:00',
      status: 'остановлен',
      processedCount: 30,
      totalCount: 100,
      initiator: 'expert02',
    },
  ]

  return (
    <div className="page-card">
      <RunsTable data={mockData} />
    </div>
  )
}

export default RunsPage

