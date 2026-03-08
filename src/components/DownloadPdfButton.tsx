// src/components/DownloadPdfButton.tsx
'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

export default function DownloadPdfButton({ filename }: { filename: string }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      // 1. Find the invoice div
      const element = document.getElementById('invoice-document')
      if (!element) throw new Error("Could not find the invoice document on the page.")

      // 2. Use the modern html-to-image to take the picture
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2, // Double resolution for crisp text
        backgroundColor: '#ffffff'
      })

      // 3. Create an image object to calculate the exact aspect ratio
      const img = new Image()
      img.src = dataUrl
      await new Promise((resolve) => { img.onload = resolve })

      // 4. Create the PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // 5. Calculate dimensions to fit the page perfectly
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (img.height * pdfWidth) / img.width

      // 6. Add image and download
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${filename}.pdf`)

    } catch (error) {
      console.error("PDF Generation Error:", error)
      alert("Failed to generate PDF. Check the console for details.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button 
      onClick={generatePDF}
      disabled={isGenerating}
      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={16} /> 
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </button>
  )
}