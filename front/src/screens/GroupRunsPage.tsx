import GroupRunsTable, { type GroupRun } from '../ui/GroupRunsTable'

const GroupRunsPage = () => {
  const mockData: GroupRun[] = [
    {
      id: 'grun-0001',
      savVersionId: 'sav-1.0.0',
      setId: 'set-0001',
      setVersion: 3,
      setName: 'Набор осмотров Q1',
      startedAt: '2026-02-17T10:00:00',
      completedAt: '2026-02-17T10:20:00',
      status: 'завершен успешно',
      processedCount: 120,
      totalCount: 120,
      initiator: 'expert01',
    },
    {
      id: 'grun-0002',
      savVersionId: 'sav-1.1.0',
      setId: 'set-0002',
      setVersion: 1,
      setName: 'Пилотный набор',
      startedAt: '2026-02-17T11:30:00',
      completedAt: undefined,
      status: 'обработка',
      processedCount: 10,
      totalCount: 50,
      initiator: 'admin',
    },
    {
      id: 'grun-0003',
      savVersionId: 'sav-1.0.0',
      setId: 'set-0003',
      setVersion: 2,
      setName: 'Набор тестовый',
      startedAt: '2026-02-16T09:30:00',
      completedAt: undefined,
      status: 'в очереди',
      processedCount: 0,
      totalCount: 30,
      initiator: 'user01',
    },
  ]

  return (
    <div className="page-card">
      <GroupRunsTable data={mockData} />
    </div>
  )
}

export default GroupRunsPage

