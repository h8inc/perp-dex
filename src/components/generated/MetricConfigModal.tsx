import React, { useState } from 'react';
import { X, GripVertical, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
export interface MetricConfig {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down';
  explanationKey?: string;
  icon?: React.ReactNode;
}
export interface SectionConfig {
  id: string;
  title: string;
  selectedMetrics: MetricConfig[];
}
interface MetricConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: SectionConfig;
  onSave: (updatedSection: SectionConfig) => void;
  availableMetrics: MetricConfig[];
}
export const MetricConfigModal: React.FC<MetricConfigModalProps> = ({
  isOpen,
  onClose,
  section,
  onSave,
  availableMetrics
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricConfig[]>(section.selectedMetrics);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  if (!isOpen) return null;
  const maxMetrics = 7;
  const canAddMore = selectedMetrics.length < maxMetrics;
  const handleSave = () => {
    onSave({
      ...section,
      selectedMetrics: selectedMetrics.slice(0, maxMetrics)
    });
    onClose();
  };
  const handleAddMetric = (metric: MetricConfig) => {
    if (selectedMetrics.length >= maxMetrics) return;
    if (selectedMetrics.find(m => m.id === metric.id)) return;
    setSelectedMetrics([...selectedMetrics, metric]);
  };
  const handleRemoveMetric = (metricId: string) => {
    setSelectedMetrics(selectedMetrics.filter(m => m.id !== metricId));
  };
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newMetrics = [...selectedMetrics];
    const draggedItem = newMetrics[draggedIndex];
    newMetrics.splice(draggedIndex, 1);
    newMetrics.splice(index, 0, draggedItem);
    setSelectedMetrics(newMetrics);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  const unselectedMetrics = availableMetrics.filter(metric => !selectedMetrics.find(m => m.id === metric.id));
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-white">
                Configure Metrics
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Add up to {maxMetrics} metrics and drag to reorder
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* Left: Selected Metrics */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">
                  Selected Metrics ({selectedMetrics.length}/{maxMetrics})
                </h3>
              </div>

              {selectedMetrics.length === 0 ? <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-white/10 rounded-lg">
                  <div className="text-zinc-500 text-sm text-center">
                    No metrics selected
                    <br />
                    <span className="text-xs">Add metrics from the available list</span>
                  </div>
                </div> : <div className="space-y-2">
                  {selectedMetrics.map((metric, index) => {
                const isDragging = draggedIndex === index;
                return <div key={metric.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={e => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={cn("flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/15 transition-all cursor-move group", isDragging && "opacity-50")}>
                        {/* Order Number */}
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </div>

                        {/* Drag Handle */}
                        <div className="flex-shrink-0">
                          <GripVertical size={18} className="text-emerald-600" />
                        </div>

                        {/* Icon */}
                        {metric.icon && <div className="flex-shrink-0 text-emerald-400">
                            {React.isValidElement(metric.icon) && React.cloneElement(metric.icon, {
                      size: 18
                    } as any)}
                          </div>}

                        {/* Label */}
                        <div className="flex-1 text-white text-sm font-normal">
                          {metric.label}
                        </div>

                        {/* Remove Button */}
                        <button onClick={() => handleRemoveMetric(metric.id)} className="flex-shrink-0 p-1 text-emerald-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <X size={16} />
                        </button>
                      </div>;
              })}
                </div>}
            </div>

            {/* Right: Available Metrics */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">
                  Available Metrics
                </h3>
              </div>

              {unselectedMetrics.length === 0 ? <div className="flex flex-col items-center justify-center py-12 px-4 border border-white/5 rounded-lg bg-zinc-900/30">
                  <div className="text-zinc-500 text-sm text-center">
                    All metrics have been added
                  </div>
                </div> : <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {unselectedMetrics.map(metric => <button key={metric.id} onClick={() => handleAddMetric(metric)} disabled={!canAddMore} className={cn("w-full flex items-center gap-3 px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-lg transition-all text-left", canAddMore ? "hover:bg-zinc-900/80 hover:border-white/10 cursor-pointer" : "opacity-50 cursor-not-allowed")}>
                      {/* Icon */}
                      {metric.icon && <div className="flex-shrink-0 text-zinc-400">
                          {React.isValidElement(metric.icon) && React.cloneElement(metric.icon, {
                    size: 18
                  } as any)}
                        </div>}

                      {/* Label */}
                      <div className="flex-1 text-white text-sm font-normal">
                        {metric.label}
                      </div>

                      {/* Add Icon */}
                      {canAddMore && <div className="flex-shrink-0 text-zinc-600 group-hover:text-emerald-400 transition-colors">
                          <Plus size={16} />
                        </div>}
                    </button>)}
                </div>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-white/5 bg-[#0a0a0a]">
          <div className="text-xs text-zinc-500">
            {selectedMetrics.length} of {maxMetrics} metrics selected
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-white border border-white/10 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
            
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-sm font-medium transition-colors">
              <Check size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>;
};