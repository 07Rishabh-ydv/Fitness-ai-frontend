import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ForkKnife, Plus, Spinner, FilePdf } from '@phosphor-icons/react';
import { exportMealPDF } from '../api';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

const MealWidget = ({ mealPlans, onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };

  const handleExportPDF = async () => {
    if (!latestPlan) return;
    try {
      const res = await exportMealPDF(latestPlan.plan_id);
      saveAs(new Blob([res.data]), `meal_plan_${latestPlan.date || 'today'}.pdf`);
      toast.success('Meal plan PDF downloaded!');
    } catch (err) {
      toast.error('Failed to export PDF');
    }
  };

  const latestPlan = mealPlans[0];
  const totalCalories = latestPlan?.meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#111111] border border-[#27272A] p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ForkKnife size={18} className="text-[#FF9500]" />
          <h3
            className="text-base font-bold tracking-tight uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            MEAL PLAN
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {latestPlan && (
            <button
              onClick={handleExportPDF}
              data-testid="export-meal-pdf-btn"
              className="p-1.5 bg-transparent border border-[#27272A] hover:bg-[#1A1A1A] transition-all duration-200"
              title="Export as PDF"
            >
              <FilePdf size={14} weight="bold" className="text-[#FF3B30]" />
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading}
            data-testid="generate-meal-btn"
            className="p-1.5 bg-transparent border border-[#27272A] hover:bg-[#1A1A1A] transition-all duration-200 disabled:opacity-50"
          >
            {loading ? <Spinner size={14} className="animate-spin" /> : <Plus size={14} weight="bold" />}
          </button>
        </div>
      </div>

      {latestPlan ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#A1A1AA]">
              {latestPlan.date}
            </span>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#FF9500]">
              {totalCalories} CAL
            </span>
          </div>
          <div className="space-y-1">
            {(expanded ? latestPlan.meals : latestPlan.meals?.slice(0, 3))?.map((meal, idx) => (
              <div key={idx} className="py-2 border-b border-[#27272A] last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#FF9500]">
                      {meal.meal_type}
                    </p>
                    <p className="text-xs text-white mt-0.5">{meal.name}</p>
                    {meal.description && expanded && (
                      <p className="text-[10px] text-[#A1A1AA] mt-0.5">{meal.description}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs text-white">{meal.calories}cal</p>
                    {expanded && meal.protein && (
                      <p className="text-[10px] text-[#A1A1AA]">P:{meal.protein}g</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {latestPlan.meals?.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              data-testid="expand-meals-btn"
              className="w-full text-center text-[10px] uppercase tracking-wide text-[#007AFF] mt-2 hover:text-white transition-colors"
            >
              {expanded ? 'Show Less' : `+${latestPlan.meals.length - 3} More`}
            </button>
          )}
        </>
      ) : (
        <p className="text-xs text-[#A1A1AA] text-center py-4 uppercase tracking-wide">
          Generate your first meal plan
        </p>
      )}
    </motion.div>
  );
};

export default MealWidget;
