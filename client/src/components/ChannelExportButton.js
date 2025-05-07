import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ChannelExportButton = ({ channelData, elementId }) => {
  const exportToPdf = async () => {
    if (!channelData) return;
    
    try {
      // Notify user that export is starting
      const notificationElement = document.createElement('div');
      notificationElement.innerHTML = `
        <div class="fixed top-5 right-5 bg-green-700 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-pulse">
          Generating PDF, please wait...
        </div>
      `;
      document.body.appendChild(notificationElement);
      
      // Wait a moment for the notification to appear
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create the PDF document with professional YouTube-themed styling
      const pdf = new jsPDF('p', 'mm', 'a4');
      const element = document.getElementById(elementId);
      
      // First, add the custom header with YouTube-style branding
      pdf.setFillColor(32, 32, 32); // Dark gray background
      pdf.rect(0, 0, 210, 297, 'F'); // Fill the entire page with dark background
      
      // Add the header with YouTube logo and branding
      pdf.setFillColor(255, 0, 0); // YouTube red
      pdf.rect(0, 0, 210, 15, 'F'); // Red header bar
      
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('YouTube Channel Analysis', 10, 10);
      
      // Add channel title and basic information
      pdf.setFontSize(12);
      pdf.text(`Channel: ${channelData.title || 'Unknown Channel'}`, 10, 25);
      pdf.text(`Subscribers: ${parseInt(channelData.statistics?.subscriberCount || 0).toLocaleString()}`, 10, 32);
      pdf.text(`Created: ${new Date(channelData.publishedAt || new Date()).toLocaleDateString()}`, 10, 39);
      
      // Create custom styling for the content
      await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#282828', // YouTube dark mode background
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate the right dimensions to fit the content
        const imgWidth = 190; // Slightly less than A4 width for margins
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Add the image to the PDF, positioned below the header info
        pdf.addImage(imgData, 'PNG', 10, 45, imgWidth, imgHeight);
        
        // Add footer with timestamp and branding
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(8);
        pdf.setTextColor(180, 180, 180); // Light gray for footer
        
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          const now = new Date();
          pdf.text(`Generated on: ${now.toLocaleString()} | YouTube Analytics by YT-Analysis Tool`, 10, 287);
          pdf.text(`Page ${i} of ${pageCount}`, 180, 287);
        }
        
        // Save the PDF with the channel title and date as filename
        const dateStr = new Date().toISOString().slice(0, 10);
        const safeTitle = (channelData.title || 'channel').replace(/[^a-z0-9]/gi, '_').substring(0, 30);
        pdf.save(`youtube_channel_${safeTitle}_${dateStr}.pdf`);
        
        // Remove the notification
        document.body.removeChild(notificationElement);
        
        // Show success notification
        const successElement = document.createElement('div');
        successElement.innerHTML = `
          <div class="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">
            PDF successfully exported!
          </div>
        `;
        document.body.appendChild(successElement);
        
        // Remove success notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(successElement);
        }, 3000);
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    }
  };

  return (
    <button
      onClick={exportToPdf}
      disabled={!channelData}
      className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1 px-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      title="Export channel data to PDF"
    >
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
      </svg>
      PDF
    </button>
  );
};

export default ChannelExportButton; 