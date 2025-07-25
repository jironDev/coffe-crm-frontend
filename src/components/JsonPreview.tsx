// src/components/JsonPreview.tsx
import React, { useState } from 'react'

interface JsonPreviewProps {
  data: any
  previewChars?: number
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ data, previewChars = 80 }) => {
  const [expanded, setExpanded] = useState(false)
  const jsonString = JSON.stringify(data, null, 2)
  const preview = jsonString.length > previewChars
    ? jsonString.slice(0, previewChars) + '…'
    : jsonString

  return (
    <div>
      <pre className="small mb-1" style={{ whiteSpace: 'pre-wrap' }}>
        {expanded ? jsonString : preview}
      </pre>
      {jsonString.length > previewChars && (
        <button
          className="btn btn-link btn-sm p-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Mostrar menos ▲' : 'Mostrar más ▼'}
        </button>
      )}
    </div>
  )
}

export default JsonPreview
