import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartLine, Plus, X } from '@phosphor-icons/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProgressWidget = ({ progressData, summary, onAddProgress }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '', bmi: '', body_fat: '', muscle_mass: '',
    calories_burned: '', workout_minutes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== '') data[k] = parseFloat(v);
    });
    await onAddProgress(data);
    setFormData({ weight: '', bmi: '', body_fat: '', muscle_mass: '', calories_burned: '', workout_minutes: '' });
    setShowForm(false);
  };

  const chartData = [...progressData].reverse().slice(-7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-[#111111] border border-[#27272A] p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ChartLine size={18} className="text-[#34C759]" />
          <h3
            className="text-base font-bold tracking-tight uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            PROGRESS
          </h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          data-testid="add-progress-btn"
          className="p-1.5 bg-transparent border border-[#27272A] hover:bg-[#1A1A1A] transition-all duration-200"
        >
          {showForm ? <X size={14} /> : <Plus size={14} weight="bold" />}
        </button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-[#0A0A0A] border border-[#27272A] p-2 text-center">
            <p className="text-[10px] text-[#A1A1AA] uppercase">Workouts</p>
            <p className="text-sm font-bold text-[#007AFF]">{summary.total_workouts_completed || 0}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#27272A] p-2 text-center">
            <p className="text-[10px] text-[#A1A1AA] uppercase">Meals</p>
            <p className="text-sm font-bold text-[#FF9500]">{summary.total_meal_plans || 0}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#27272A] p-2 text-center">
            <p className="text-[10px] text-[#A1A1AA] uppercase">Trend</p>
            <p className="text-sm font-bold text-[#34C759] capitalize">{summary.trend || '-'}</p>
          </div>
        </div>
      )}

      {/* Add Progress Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-2 mb-3 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'weight', label: 'Weight (kg)', placeholder: '75' },
                { key: 'body_fat', label: 'Body Fat %', placeholder: '15' },
                { key: 'muscle_mass', label: 'Muscle (kg)', placeholder: '35' },
                { key: 'calories_burned', label: 'Calories', placeholder: '500' }
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-[10px] text-[#A1A1AA] uppercase block mb-0.5">{label}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData[key]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    data-testid={`progress-${key}`}
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              data-testid="save-progress-btn"
              className="w-full bg-[#34C759] text-white font-bold py-2 uppercase tracking-[0.1em] text-[10px] hover:bg-[#2EA84D] transition-all"
            >
              Save Entry
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="space-y-3">
          {chartData.some(d => d.weight) && (
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase mb-1">Weight (kg)</p>
              <div className="h-[80px]" data-testid="progress-weight-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111111',
                        border: '1px solid #27272A',
                        borderRadius: 0,
                        fontSize: '10px'
                      }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#FF3B30" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {chartData.some(d => d.calories_burned) && (
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase mb-1">Calories Burned</p>
              <div className="h-[60px]" data-testid="progress-calories-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111111',
                        border: '1px solid #27272A',
                        borderRadius: 0,
                        fontSize: '10px'
                      }}
                    />
                    <Bar dataKey="calories_burned" fill="#007AFF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-[#A1A1AA] text-center py-4 uppercase tracking-wide">
          Log your first entry
        </p>
      )}
    </motion.div>
  );
};

export default ProgressWidget;
