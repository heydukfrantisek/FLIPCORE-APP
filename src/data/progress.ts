interface ProgressItem {
  name: string;
  progress: number; // 0-100
  status: 'planning' | 'development' | 'testing' | 'completed';
}

export const progressData: ProgressItem[] = [
  { name: 'FLIPCORE-OS Core', progress: 80, status: 'development' },
  { name: 'Inventory Module', progress: 100, status: 'completed' },
  { name: 'Finance Module', progress: 100, status: 'completed' },
  { name: 'Reports Module', progress: 90, status: 'testing' },
  { name: 'Progress Page', progress: 100, status: 'completed' },
];
