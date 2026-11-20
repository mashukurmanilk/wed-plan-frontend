'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ChecklistTask {
  id: string;
  phase: '12-9 Months' | '8-6 Months' | '5-3 Months' | '2-1 Months' | 'Wedding Week';
  title: string;
  category: string;
  completed: boolean;
}

const INITIAL_TASKS: ChecklistTask[] = [
  { id: 't1', phase: '12-9 Months', title: 'Set estimated wedding budget with partner and families', category: 'Budget', completed: true },
  { id: 't2', phase: '12-9 Months', title: 'Draft initial guest list and estimated headcount', category: 'Guests', completed: true },
  { id: 't3', phase: '12-9 Months', title: 'Tour and book dream wedding venue or château estate', category: 'Venue', completed: true },
  { id: 't4', phase: '12-9 Months', title: 'Hire fine-art film photographer & videographer', category: 'Photo', completed: false },
  
  { id: 't5', phase: '8-6 Months', title: 'Select wedding couture gown, veil, and accessories', category: 'Fashion', completed: false },
  { id: 't6', phase: '8-6 Months', title: 'Reserve botanical florist and design ceremony arch', category: 'Decor', completed: false },
  { id: 't7', phase: '8-6 Months', title: 'Curate farm-to-table tasting and confirm catering menu', category: 'Catering', completed: false },
  { id: 't8', phase: '8-6 Months', title: 'Send out Save the Date cards to guests', category: 'Stationery', completed: false },

  { id: 't9', phase: '5-3 Months', title: 'Schedule hair and makeup bridal preview trial', category: 'Beauty', completed: false },
  { id: 't10', phase: '5-3 Months', title: 'Mail formal wedding invitations and open online RSVPs', category: 'Guests', completed: false },
  { id: 't11', phase: '5-3 Months', title: 'Select bridal party attire and groom tuxedos', category: 'Fashion', completed: false },

  { id: 't12', phase: '2-1 Months', title: 'Finalize seating chart and place card calligraphy', category: 'Coordination', completed: false },
  { id: 't13', phase: '2-1 Months', title: 'Confirm final headcount with venue and caterer', category: 'Catering', completed: false },
  { id: 't14', phase: '2-1 Months', title: 'Review day-of timeline and music playlist with DJ/Band', category: 'Music', completed: false },

  { id: 't15', phase: 'Wedding Week', title: 'Rehearsal dinner walk-through with wedding party', category: 'Coordination', completed: false },
  { id: 't16', phase: 'Wedding Week', title: 'Pack bridal emergency kit & day-of accessories', category: 'General', completed: false },
  { id: 't17', phase: 'Wedding Week', title: 'Relax, celebrate, and say &quot;I do!&quot; ❤️', category: 'Celebration', completed: false },
];

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<ChecklistTask[]>(INITIAL_TASKS);
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ChecklistTask = {
      id: `custom_${Date.now()}`,
      phase: selectedPhase === 'All' ? '12-9 Months' : (selectedPhase as any),
      title: newTaskTitle.trim(),
      category: 'Custom',
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedPhase !== 'All' && t.phase !== selectedPhase) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
            Loverly Digital Planning Tool
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] mt-3">
            12-Month Wedding Planning Checklist
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Every critical wedding milestone broken down into organized, stress-free phases.
          </p>
        </div>

        {/* Progress Bar Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Wedding Readiness
              </span>
              <p className="font-serif text-xl font-bold text-[#152232]">
                {completedCount} of {tasks.length} Milestones Completed
              </p>
            </div>
            <span className="font-serif text-3xl font-bold text-[#B85D43]">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#B85D43] to-[#C5A059] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Phase Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', '12-9 Months', '8-6 Months', '5-3 Months', '2-1 Months', 'Wedding Week'].map(
            (phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedPhase === phase
                    ? 'bg-[#B85D43] text-white shadow'
                    : 'bg-white border border-[#E8DFD3] text-stone-700 hover:bg-[#FAF7F2]'
                }`}
              >
                {phase}
              </button>
            )
          )}
        </div>

        {/* Add Custom Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-3">
          <input
            type="text"
            placeholder="Add your own custom wedding milestone..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-[#152232] text-white text-xs font-semibold hover:bg-stone-800 transition-colors shrink-0"
          >
            + Add Milestone
          </button>
        </form>

        {/* Tasks List */}
        <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 shadow-sm space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                  : 'bg-white border-[#E8DFD3] hover:border-[#B85D43] text-stone-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300 shrink-0" />
                )}
                <div>
                  <span className="text-xs sm:text-sm font-medium leading-snug">{task.title}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase">
                      {task.phase}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] text-stone-500 font-mono">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
