import Header from '../Header';

export default function HeaderExample() {
  return (
    <div className="bg-background">
      <Header 
        onSearch={(query) => console.log('Search:', query)}
      />
      <div className="p-8">
        <p className="text-muted-foreground">Page content goes here...</p>
      </div>
    </div>
  );
}
