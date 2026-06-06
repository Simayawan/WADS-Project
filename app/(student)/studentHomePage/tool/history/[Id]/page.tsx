import React from 'react';

export default function HistoryDetailPage({ params }: { params: { Id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">History Detail</h1>
      <p>Viewing record for ID: {params.Id}</p>
    </div>
  );
}