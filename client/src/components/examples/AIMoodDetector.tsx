import AIMoodDetector from '../AIMoodDetector';

export default function AIMoodDetectorExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <AIMoodDetector 
          onMoodDetected={(mood, confidence) => {
            console.log('Mood detected:', mood, 'Confidence:', confidence);
          }}
        />
      </div>
    </div>
  );
}
