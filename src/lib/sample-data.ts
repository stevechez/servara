import { Job } from '@/types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    customer_name: 'Sarah Jenkins',
    service_type: 'Pressure Washing',
    status: 'paid',
    amount: 250.0,
    location: 'Oak Ridge Estate',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    customer_name: 'Marcus Thorne',
    service_type: 'Gutter Cleaning',
    status: 'completed',
    amount: 175.5,
    location: 'Cedar Valley',
    created_at: new Date().toISOString(),
  },
  // Add 3-4 more here...
];
