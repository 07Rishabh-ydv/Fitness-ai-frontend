import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Barbell, Plus, CheckCircle, Spinner, FilePdf } from '@phosphor-icons/react';
import { exportWorkoutPDF } from '../api';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

const WorkoutWidget = ({ workouts, onGenerate, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };

  const handleExportPDF = async () => {
    if (!latestWorkout) return;
    try {
      const res = await exportWorkoutPDF(latestWorkout.workout_id);
      saveAs(new Blob([res.data]), `workout_${latestWorkout.date || 'today'}.pdf`);
      toast.success('Workout PDF downloaded!');
    } catch (err) {
      toast.error('Failed to export PDF');
    }
  };

  const latestWorkout = workouts[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#111111] border border-[#27272A] p-4 sm:p-5 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url('https://static.prod-images.emergentagent.com/jobs/642fb84d-8ee6-4082-a35e-cd6b395c1a21/images/267aaa09f89f094ba01213cd75908dfd693d16c6257e2778009203a9c069c631.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Barbell size={18} className="text-[#007AFF]" />
            <h3
              className="text-base font-bold tracking-tight uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              WORKOUT
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {latestWorkout && (
              <button
                onClick={handleExportPDF}
                data-testid="export-workout-pdf-btn"
                className="p-1.5 bg-transparent border border-[#27272A] hover:bg-[#1A1A1A] transition-all duration-200"
                title="Export as PDF"
              >
                <FilePdf size={14} weight="bold" className="text-[#FF3B30]" />
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading}
              data-testid="generate-workout-btn"
              className="p-1.5 bg-transparent border border-[#27272A] hover:bg-[#1A1A1A] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? <Spinner size={14} className="animate-spin" /> : <Plus size={14} weight="bold" />}
            </button>
          </div>
        </div>

        {latestWorkout ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#A1A1AA]">
                {latestWorkout.date}
              </span>
              {latestWorkout.completed && (
                <span className="flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] uppercase text-[#34C759]">
                  <CheckCircle size={12} /> DONE
                </span>
              )}
            </div>
            <div className="space-y-1">
              {(expanded ? latestWorkout.exercises : latestWorkout.exercises?.slice(0, 4))?.map((ex, idx) => (
                <div key={idx} className="py-1.5 border-b border-[#27272A] last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white">{ex.name}</p>
                      {expanded && ex.muscle_group && (
                        <p className="text-[10px] text-[#007AFF] mt-0.5">{ex.muscle_group}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-[10px] text-[#A1A1AA]">
                        {ex.sets}x{ex.reps}
                      </p>
                      {expanded && ex.rest && (
                        <p className="text-[10px] text-[#A1A1AA]">Rest: {ex.rest}</p>
                      )}
                    </div>
                  </div>
                  {expanded && ex.tips && (
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5 italic">{ex.tips}</p>
                  )}
                </div>
              ))}
            </div>
            {latestWorkout.exercises?.length > 4 && (
              <button
                onClick={() => setExpanded(!expanded)}
                data-testid="expand-workout-btn"
                className="w-full text-center text-[10px] uppercase tracking-wide text-[#007AFF] mt-2 hover:text-white transition-colors"
              >
                {expanded ? 'Show Less' : `+${latestWorkout.exercises.length - 4} More`}
              </button>
            )}
            {!latestWorkout.completed && (
              <button
                onClick={() => onComplete(latestWorkout.workout_id)}
                data-testid="complete-workout-btn"
                className="w-full bg-[#34C759] text-white font-bold py-2 px-4 uppercase tracking-[0.1em] text-[10px] hover:bg-[#2EA84D] transition-all duration-200 mt-3"
              >
                Mark Complete
              </button>
            )}
          </>
        ) : (
          <p className="text-xs text-[#A1A1AA] text-center py-4 uppercase tracking-wide">
            Generate your first workout
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default WorkoutWidget;
