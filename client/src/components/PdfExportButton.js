import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfExportButton = ({ videoData, elementId }) => {
  const exportToPdf = async () => {
    if (!videoData) return;
    
    try {
      // Notify user that export is starting
      const notificationElement = document.createElement('div');
      notificationElement.innerHTML = `
        <div class="fixed top-5 right-5 bg-green-700 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-pulse">
          Generating PDF, please wait...
        </div>
      `;
      document.body.appendChild(notificationElement);
      
      // Wait a moment for notification to appear
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create the PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const element = document.getElementById(elementId);
      
      // Add title and video information at the top
      pdf.setFillColor(255, 0, 0); // YouTube red
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('YouTube Video Analysis', 105, 12, { align: 'center' });
      
      // Add video details
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 20, 210, 40, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      
      // Video title - truncate if too long
      const title = videoData.title.length > 60 
        ? videoData.title.substring(0, 57) + '...' 
        : videoData.title;
      pdf.text(`Title: ${title}`, 10, 30);
      
      // Channel info
      pdf.text(`Channel: ${videoData.channelTitle}`, 10, 38);
      
      // Stats info
      pdf.text(`Views: ${parseInt(videoData.statistics.viewCount).toLocaleString()}`, 10, 46);
      
      const likesText = videoData.statistics.likeCount 
        ? `Likes: ${parseInt(videoData.statistics.likeCount).toLocaleString()}` 
        : 'Likes: Not available';
      pdf.text(likesText, 80, 46);
      
      const commentsText = videoData.statistics.commentCount 
        ? `Comments: ${parseInt(videoData.statistics.commentCount).toLocaleString()}` 
        : 'Comments: Not available';
      pdf.text(commentsText, 140, 46);
      
      // Date published
      pdf.text(`Published: ${new Date(videoData.publishedAt).toLocaleDateString()}`, 10, 54);
      
      // Add YouTube link
      const videoUrl = `https://www.youtube.com/watch?v=${videoData.id}`;
      pdf.setTextColor(0, 0, 255);
      pdf.text(`YouTube Link: ${videoUrl}`, 105, 54, { align: 'center' });
      
      // Capture the analytics content
      await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate the dimensions to fit the content properly
        const imgWidth = 190; // Slightly less than A4 width for margins
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Add the image to the PDF below the header
        pdf.addImage(imgData, 'PNG', 10, 65, imgWidth, imgHeight);
        
        // Add footer with timestamp
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          const now = new Date();
          pdf.text(`Generated on: ${now.toLocaleString()} | YouTube Analytics Tool`, 105, 290, { align: 'center' });
          pdf.text(`Page ${i} of ${pageCount}`, 195, 290, { align: 'right' });
        }
        
        // Save the PDF with the video title and date as filename
        const dateStr = new Date().toISOString().slice(0, 10);
        const safeTitle = videoData.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
        pdf.save(`youtube_video_${safeTitle}_${dateStr}.pdf`);
        
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
      disabled={!videoData}
      className="bg-youtube-red hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
      </svg>
      Export to PDF
    </button>
  );
};

export default PdfExportButton; 