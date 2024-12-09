'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Chart as ChartJS } from 'chart.js/auto';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';
import { ChevronDown, Search } from 'lucide-react';

export default function ModernDashboard() {
    const [incomePerDays, setIncomePerDays] = useState<any[]>([]);
    const [incomePerMonths, setIncomePerMonths] = useState<any[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [monthName, setMonthName] = useState<string[]>([
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]);
    const [days, setDays] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
    const [month, setMonth] = useState<number>(dayjs().month() + 1);
    const [chartPerDay, setChartPerDay] = useState<ChartJS | null>(null);
    const [chartPerMonth, setChartPerMonth] = useState<ChartJS | null>(null);

    useEffect(() => {
        const totalDayInMonth = dayjs().daysInMonth();

        setDays(Array.from({ length: totalDayInMonth }, (_, index) => index + 1));
        setYears(Array.from({ length: 5 }, (_, index) => dayjs().year() - index));

        fetchData();
    }, []);

    const fetchData = () => {
        fetchDataSumPerDayInYearAndMonth();
        fetchDataSumPerMonthInYear();
    }

    const createBarChartDays = (incomePerDays: any[]) => {
        let labels: number[] = [];
        let datas: number[] = [];

        for (let i = 0; i < incomePerDays.length; i++) {
            const item = incomePerDays[i];
            labels.push(i + 1);
            datas.push(item.amount);
        }

        const ctx = document.getElementById('chartPerDay') as HTMLCanvasElement;

        if (chartPerDay) {
            chartPerDay.destroy();
        }

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total income by day ($)',
                    data: datas,
                    borderWidth: 1,
                    borderColor: '#4ade80',
                    backgroundColor: '#4ade80',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        })

        setChartPerDay(chart);
    }

    const fetchDataSumPerDayInYearAndMonth = async () => {
        try {
            const payload = {
                year: selectedYear,
                month: month
            }

            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(config.token)
            }

            const res = await axios.post(`${config.apiServer}/api/report/sumPerDayInYearAndMonth`, payload, {headers});
            setIncomePerDays(res.data.results);
            createBarChartDays(res.data.results);
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: e.message,
                background: '#1f2937',
                color: '#ffffff'
            });
        }
    }

    const createBarChartMonths = (incomePerMonths: any[]) => {
        let datas: number[] = [];

        for (let i = 0; i < incomePerMonths.length; i++) {
            datas.push(incomePerMonths[i].amount);
        }

        const ctx = document.getElementById('chartPerMonth') as HTMLCanvasElement;

        if (chartPerMonth) {
            chartPerMonth.destroy();
        }

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: monthName,
                datasets: [{
                    label: 'Total income by month ($)',
                    data: datas,
                    borderWidth: 1,
                    backgroundColor: '#22d3ee',
                    borderColor: '#22d3ee'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        })

        setChartPerMonth(chart);
    }

    const fetchDataSumPerMonthInYear = async () => {
        try {
            const payload = {
                year: selectedYear
            }
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(config.token)
            }

            const res = await axios.post(`${config.apiServer}/api/report/sumPerMonthInYear`, payload, {headers});
            setIncomePerMonths(res.data.results);
            createBarChartMonths(res.data.results);
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: e.message,
                background: '#1f2937',
                color: '#ffffff'
            });
        }
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                    <h2 className="text-2xl font-semibold text-white">Sales Dashboard</h2>
                </div>
                <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    value={selectedYear} 
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                >
                                    {years.map((item, index) => (
                                        <option key={index} value={item} className="bg-gray-800">{item}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Month</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    value={month} 
                                    onChange={(e) => setMonth(parseInt(e.target.value))}
                                >
                                    {monthName.map((item, index) => (
                                        <option key={index} value={index + 1} className="bg-gray-800">{item}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button 
                                onClick={fetchData} 
                                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                            >
                                <Search className="mr-2" size={20} />
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-white">Daily Sales Summary</h3>
                            <canvas id='chartPerDay' className="w-full" />
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-white">Monthly Sales Summary</h3>
                            <canvas id='chartPerMonth' className="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}