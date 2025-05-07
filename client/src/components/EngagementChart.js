import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EngagementChart = ({ data, type }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (!data) return;

    if (type === 'video') {
      // Prepare data for video engagement chart
      setChartData({
        labels: ['Views', 'Likes', 'Comments'],
        datasets: [
          {
            label: 'Video Engagement',
            data: [
              parseInt(data.statistics.viewCount) || 0,
              parseInt(data.statistics.likeCount) || 0,
              parseInt(data.statistics.commentCount) || 0,
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',  // Red
              'rgba(54, 162, 235, 0.8)',  // Blue
              'rgba(255, 206, 86, 0.8)',  // Yellow
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } else if (type === 'channel') {
      // Prepare data for channel engagement chart
      setChartData({
        labels: ['Subscribers', 'Total Views', 'Total Videos'],
        datasets: [
          {
            label: 'Channel Statistics',
            data: [
              parseInt(data.statistics.subscriberCount) || 0,
              parseInt(data.statistics.viewCount) || 0,
              parseInt(data.statistics.videoCount) || 0,
            ],
            backgroundColor: [
              'rgba(153, 102, 255, 0.8)', // Purple
              'rgba(75, 192, 192, 0.8)',  // Green
              'rgba(255, 159, 64, 0.8)',  // Orange
            ],
            borderColor: [
              'rgba(153, 102, 255, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } else if (type === 'engagement') {
      // Only for video data
      setChartData({
        labels: ['Engagement Rate (%)'],
        datasets: [
          {
            label: 'Engagement Rate',
            data: [parseFloat(data.engagementRate) || 0],
            backgroundColor: ['rgba(255, 0, 0, 0.8)'], // YouTube Red
            borderColor: ['rgba(255, 0, 0, 1)'],
            borderWidth: 1,
          },
        ],
      });
    }

    // Set chart options
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#fff',
          }
        },
        title: {
          display: true,
          text: type === 'video' ? 'Video Statistics' : 
                 type === 'channel' ? 'Channel Statistics' : 'Engagement Rate',
          color: '#fff',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#fff',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          }
        },
        x: {
          ticks: {
            color: '#fff',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          }
        }
      },
    });
  }, [data, type]);

  if (!data) {
    return <div className="text-center text-white">No data available</div>;
  }

  return (
    <div className="bg-youtube-gray p-4 rounded-lg shadow-lg">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
};

export default EngagementChart; 