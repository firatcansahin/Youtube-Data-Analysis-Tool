import React from 'react';
import * as XLSX from 'xlsx';

const ExcelExportButton = ({ data, dataType = 'channel' }) => {
  const exportToExcel = () => {
    if (!data) return;
    
    try {
      // Create a notification
      const notificationElement = document.createElement('div');
      notificationElement.innerHTML = `
        <div class="fixed top-5 right-5 bg-green-700 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-pulse">
          Generating Excel file...
        </div>
      `;
      document.body.appendChild(notificationElement);
      
      // Prepare the workbook
      const wb = XLSX.utils.book_new();
      
      // Format data based on type
      let mainSheet = [];
      let statsSheet = [];
      let videosSheet = [];
      let title = '';
      
      if (dataType === 'channel') {
        title = data.title || 'YouTube Channel';
        
        // Main overview sheet
        mainSheet = [
          ['YouTube Channel Analysis Report'],
          ['Generated on', new Date().toLocaleString()],
          [''],
          ['Channel Title', data.title || 'Unknown Channel'],
          ['Channel ID', data.id || 'Unknown'],
          ['Creation Date', data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : 'Unknown'],
          ['Description', data.description || 'No description available'],
          ['Custom URL', data.customUrl || 'Not available'],
          ['Country', data.country || 'Not specified'],
          ['']
        ];
        
        // Statistics sheet
        statsSheet = [
          ['YouTube Channel Statistics'],
          [''],
          ['Metric', 'Value'],
          ['Subscribers', data.statistics && data.statistics.subscriberCount ? 
            parseInt(data.statistics.subscriberCount).toLocaleString() : '0'],
          ['Total Views', data.statistics && data.statistics.viewCount ? 
            parseInt(data.statistics.viewCount).toLocaleString() : '0'],
          ['Total Videos', data.statistics && data.statistics.videoCount ? 
            parseInt(data.statistics.videoCount).toLocaleString() : '0'],
          ['']
        ];
        
        // If we have recent videos, add them to a separate sheet
        if (data.recentVideos && data.recentVideos.length) {
          // Header row
          videosSheet.push([
            'Video Title',
            'Published Date',
            'Views',
            'Likes',
            'Comments',
            'Duration',
            'Video ID'
          ]);
          
          // Data rows
          data.recentVideos.forEach(video => {
            if (!video) return;
            
            videosSheet.push([
              video.title || 'Unknown title',
              video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : 'Unknown date',
              video.statistics && video.statistics.viewCount ? 
                parseInt(video.statistics.viewCount).toLocaleString() : 'N/A',
              video.statistics && video.statistics.likeCount ? 
                parseInt(video.statistics.likeCount).toLocaleString() : 'N/A',
              video.statistics && video.statistics.commentCount ? 
                parseInt(video.statistics.commentCount).toLocaleString() : 'N/A',
              video.duration || 'N/A',
              video.id || 'Unknown'
            ]);
          });
        }
      } else if (dataType === 'video') {
        title = data.title || 'YouTube Video';
        
        // Main overview sheet
        mainSheet = [
          ['YouTube Video Analysis Report'],
          ['Generated on', new Date().toLocaleString()],
          [''],
          ['Video Title', data.title || 'Unknown Video'],
          ['Video ID', data.id || 'Unknown'],
          ['Channel Title', data.channelTitle || 'Unknown Channel'],
          ['Channel ID', data.channelId || 'Unknown'],
          ['Published Date', data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : 'Unknown'],
          ['Description', data.description || 'No description available'],
          ['Tags', data.tags ? data.tags.join(', ') : 'None'],
          ['']
        ];
        
        // Statistics sheet
        statsSheet = [
          ['YouTube Video Statistics'],
          [''],
          ['Metric', 'Value'],
          ['Views', data.statistics && data.statistics.viewCount ? 
            parseInt(data.statistics.viewCount).toLocaleString() : 'N/A'],
          ['Likes', data.statistics && data.statistics.likeCount ? 
            parseInt(data.statistics.likeCount).toLocaleString() : 'N/A'],
          ['Comments', data.statistics && data.statistics.commentCount ? 
            parseInt(data.statistics.commentCount).toLocaleString() : 'N/A'],
          ['Duration', data.duration || 'N/A'],
          ['Definition', data.definition ? data.definition.toUpperCase() : 'N/A'],
          ['Dimension', data.dimension ? data.dimension.toUpperCase() : 'N/A'],
          ['']
        ];
      }
      
      // Add the sheets to the workbook
      const mainWs = XLSX.utils.aoa_to_sheet(mainSheet);
      XLSX.utils.book_append_sheet(wb, mainWs, "Overview");
      
      const statsWs = XLSX.utils.aoa_to_sheet(statsSheet);
      XLSX.utils.book_append_sheet(wb, statsWs, "Statistics");
      
      if (videosSheet.length > 0) {
        const videosWs = XLSX.utils.aoa_to_sheet(videosSheet);
        XLSX.utils.book_append_sheet(wb, videosWs, "Recent Videos");
      }
      
      // Set column widths for better readability
      const wscols = [
        {wch: 20}, // Column A width
        {wch: 30}, // Column B width
        {wch: 15}, // Column C width
        {wch: 15}, // Column D width
        {wch: 15}  // Column E width
      ];
      
      if (mainWs['!cols']) mainWs['!cols'] = wscols;
      else mainWs['!cols'] = wscols;
      
      if (statsWs['!cols']) statsWs['!cols'] = wscols;
      else statsWs['!cols'] = wscols;
      
      // Generate the Excel file
      const dateStr = new Date().toISOString().slice(0, 10);
      const safeTitle = (title || 'unknown').replace(/[^a-z0-9]/gi, '_').substring(0, 30);
      XLSX.writeFile(wb, `youtube_${dataType}_${safeTitle}_${dateStr}.xlsx`);
      
      // Remove the notification
      document.body.removeChild(notificationElement);
      
      // Show success notification
      const successElement = document.createElement('div');
      successElement.innerHTML = `
        <div class="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">
          Excel file successfully exported!
        </div>
      `;
      document.body.appendChild(successElement);
      
      // Remove success notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successElement);
      }, 3000);
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Excel export failed. Please try again.');
    }
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={!data}
      className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1 px-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      title="Export data to Excel spreadsheet"
    >
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h12V4H4zm3 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
      Excel
    </button>
  );
};

export default ExcelExportButton; 