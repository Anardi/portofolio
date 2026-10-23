'use client'

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-pri no-print w-full sm:w-auto">
      Simpan sebagai PDF
    </button>
  )
}
