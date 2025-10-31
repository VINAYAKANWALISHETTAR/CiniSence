import MoodDistributionChart from '../MoodDistributionChart';

export default function MoodDistributionChartExample() {
  const mockData = [
    { mood: 'Happy', count: 12, color: '#eab308' },
    { mood: 'Sad', count: 5, color: '#3b82f6' },
    { mood: 'Romantic', count: 8, color: '#ec4899' },
    { mood: 'Adventurous', count: 15, color: '#22c55e' },
    { mood: 'Angry', count: 3, color: '#ef4444' },
    { mood: 'Relaxed', count: 10, color: '#06b6d4' },
  ];

  return (
    <div className="p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <MoodDistributionChart data={mockData} />
      </div>
    </div>
  );
}
