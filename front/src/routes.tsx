import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './ui/AppLayout'
import InspectionsPage from './screens/InspectionsPage'
import SetsPage from './screens/SetsPage'
import RunsPage from './screens/RunsPage'
import CalculationsPage from './screens/CalculationsPage'
import NotesPage from './screens/NotesPage'
import InspectionDetailsPage from './screens/InspectionDetailsPage'
import SetDetailsPage from './screens/SetDetailsPage'
import RunDetailsPage from './screens/RunDetailsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <InspectionsPage />,
      },
      {
        path: 'inspections',
        element: <InspectionsPage />,
      },
      {
        path: 'inspections/:id',
        element: <InspectionDetailsPage />,
      },
      {
        path: 'sets',
        element: <SetsPage />,
      },
      {
        path: 'sets/:id',
        element: <SetDetailsPage />,
      },
      {
        path: 'runs',
        element: <RunsPage />,
      },
      {
        path: 'runs/:id',
        element: <RunDetailsPage />,
      },
      {
        path: 'calculations',
        element: <CalculationsPage />,
      },
      {
        path: 'notes',
        element: <NotesPage />,
      },
    ],
  },
])

export default router

