'use client'

import config from "@/app/config";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ReportSumSalePerDay() {
    const [arrYear, setArrYear] = useState<number[]>([]);
    const [arrMonth] = useState(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() +1);
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        setArrYear(Array.from({ length: 5}, (_, index) => dayjs().year() - index));
        fetchData();
    },[])

    const fetchData = async () => {
       try{
        const payload = {
            year: selectedYear,
            month: selectedMonth
        }

        const res = await axios.post(config.apiServer + "/api/report/sumPerDayInYearAndMonth", payload);
        setData(res.data.results);
        setTotalAmount(sumTotalAmount(res.data.results));
       }catch(e: any){
        Swal.fire({
            title: "Error",
            text: e.message,
            icon: "error",
        })
       }
    }

    const sumTotalAmount = (data: any) => {
        let sum = 0;
        data.forEach((item: any) => {
            sum += item.amount;
        })
        return sum;
    }

    return (
        <div className='card mt-3'>
            <div className='card-header'>Sales each day</div>
            <div className='card-body'>
                <div className='row'>
                    <div className='col-md-3'>
                        <div>Year</div>
                        <select
                            className='form-control'
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                            {arrYear.map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className='col-md-3'>
                        <div>Month</div>
                        <select
                            className='form-control'
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                            {arrMonth.map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                        </select>
                    </div>
                    <div className='col-md-3'>
                        <div>&nbsp;</div>
                        <button className='btn btn-primary' onClick={fetchData}>
                            <i className='fa fa-search me-2'></i>
                            Search
                        </button>
                    </div>
                </div>

                <table className='table table-bordered table-striped mt-3'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th className='text-end' style={{ width: '100px' }}>Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{dayjs(item.date).format('DD')}</td>
                                <td className='text-end'>{item.amount.toLocaleString('th-TH')}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <th className='text-end'>{totalAmount.toLocaleString('th-TH')}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}