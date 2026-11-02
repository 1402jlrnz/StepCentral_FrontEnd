import React, { useState, useEffect } from 'react'
import {
    LineChart, Line, BarChart, Bar,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getToken } from '../Utils/helpers';
import { formatPrice } from '../Utils/helpers';
import axios from 'axios';
import Loader from '../Layout/Loader';

const SalesChart = () => {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [totals, setTotals] = useState({ totalSales: 0, totalOrders: 0 })
    const [chartType, setChartType] = useState('line')

    // Default range: first day of current month → today
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const toISO = (d) => d.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(toISO(firstOfMonth));
    const [endDate, setEndDate] = useState(toISO(today));

    const fetchSales = async () => {
        try {
            setLoading(true);
            const config = { headers: { 'Authorization': `Bearer ${getToken()}` } }
            const { data } = await axios.get(
                `${import.meta.env.VITE_API}/admin/sales?startDate=${startDate}&endDate=${endDate}`,
                config
            )
            setSales(data.sales)
            setTotals({ totalSales: data.totalSales, totalOrders: data.totalOrders })
            setError('')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load sales')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSales() }, [])

    const submitHandler = (e) => {
        e.preventDefault()
        fetchSales()
    }

    return (
        <div className="card mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Sales Report</h4>
                <button
                    className="btn btn-light btn-sm"
                    onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                >
                    Switch to {chartType === 'line' ? 'Bar' : 'Line'} Chart
                </button>
            </div>

            <div className="card-body">
                {/* Error message */}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Date range filter */}
                <form onSubmit={submitHandler} className="row mb-4">
                    <div className="col-md-4 mb-2">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            max={endDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-2">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            min={startDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Loading...' : 'Apply Filter'}
                        </button>
                    </div>
                </form>

                {/* Summary cards */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="alert alert-success mb-0">
                            <strong>Total Sales:</strong> ₱{formatPrice(totals.totalSales)}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="alert alert-info mb-0">
                            <strong>Total Orders:</strong> {totals.totalOrders}
                        </div>
                    </div>
                </div>

                {/* Chart */}
                {loading ? <Loader /> : (
                    sales.length === 0 ? (
                        <p className="text-muted text-center">No sales found in this date range.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={450}>
                            {chartType === 'line' ? (
                                <LineChart data={sales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: '#a1a1aa' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                    />
                                    <YAxis tick={{ fill: '#a1a1aa' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fafafa' }}
                                        formatter={(value) => [`₱${formatPrice(value)}`, 'Sales']}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        name="Sales ($)"
                                        stroke="#ff3b3b"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: '#ff3b3b' }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            ) : (
                                <BarChart data={sales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: '#a1a1aa' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                    />
                                    <YAxis tick={{ fill: '#a1a1aa' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fafafa' }}
                                        formatter={(value) => [`₱${formatPrice(value)}`, 'Sales']}
                                    />
                                    <Legend />
                                    <Bar dataKey="total" name="Sales ($)" fill="#ff3b3b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    )
                )}
            </div>
        </div>
    )
}

export default SalesChart