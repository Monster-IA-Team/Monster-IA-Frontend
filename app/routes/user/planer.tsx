import { useState, useEffect, type FormEvent } from "react";
import { Link, type Route } from "react-router";
import { plannerAPI } from "../../services/planner";
import { ProtectedRoute } from "../../contexts/AuthContext";
import type { Task, PlannerItem, PlannerDetails } from "../../services/types";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Planner" },
    { name: "description", content: "Schedule planner" },
  ];
}

function PlannerPage() {
  const [wake, setWake] = useState("08:00");
  const [sleep, setSleep] = useState("23:00");
  const [monsterCount, setMonsterCount] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskStart, setNewTaskStart] = useState("");
  const [newTaskEnd, setNewTaskEnd] = useState("");

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [plannerResult, setPlannerResult] = useState<PlannerDetails | null>(null);

  const [history, setHistory] = useState<PlannerItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedSchedule, setSelectedSchedule] = useState<PlannerItem | null>(null);
  const [selectedScheduleDetails, setSelectedScheduleDetails] = useState<PlannerDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeletePlan = async () => {
    if (!selectedSchedule) return;

    setDeleteLoading(true);
    try {
      await plannerAPI.deletePlanner(selectedSchedule.id);
      setDeleteConfirm(false);
      setSelectedSchedule(null);
      setSelectedScheduleDetails(null);
      setError(null);
      await loadHistory();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete plan";
      setError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await plannerAPI.getHistory({
        page,
        size: 10,
        sort_order: sortOrder,
      });

      if (response.is_success) {
        setHistory(response.data.items);
        setTotalPages(response.data.total_pages);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load history";
      setError(message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [page, sortOrder]);

  useEffect(() => {
    const fetchPlannerDetails = async () => {
      if (!selectedSchedule) {
        setSelectedScheduleDetails(null);
        return;
      }

      setDetailsLoading(true);
      try {
        const response = await plannerAPI.getPlannerDetails(selectedSchedule.id);

        if (response.is_success) {
          setSelectedScheduleDetails(response.data);
        } else {
          setError(response.message || "Failed to load planner details");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load planner details";
        setError(message);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchPlannerDetails();
  }, [selectedSchedule]);

  const handleAddTask = () => {
    if (newTaskStart && newTaskEnd) {
      setTasks([...tasks, { start: newTaskStart, end: newTaskEnd }]);
      setNewTaskStart("");
      setNewTaskEnd("");
    }
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await plannerAPI.createSchedule({
        wake,
        sleep,
        tasks,
        monster_count: monsterCount,
      });

      if (!response.is_success) {
        throw new Error(response.message || "Failed to create schedule");
      }

      setSuccess(true);
      setPlannerResult(response.data);
      setWake("08:00");
      setSleep("23:00");
      setMonsterCount(0);
      setTasks([]);

      setTimeout(() => {
        loadHistory();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create schedule";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-8 relative overflow-hidden"
      style={{
        backgroundColor: "#1a1a1a",
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,.03) 2px,
          rgba(255,255,255,.03) 4px
        )`,
      }}
    >
      {/* Home button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold"
          title="Home"
        >
          ⌂
        </Link>
      </div>

      {/* Info button */}
      <div className="absolute top-6 right-6">
        <button className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold">
          i
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        {/* Title */}
        <h1 className="text-4xl text-lime-500 text-center mb-12 font-bold">
          PLANNER
        </h1>

        {/* Create Schedule Form */}
        <div className="bg-black/40 border-2 border-lime-500 rounded-lg p-8 mb-12">
          <h2 className="text-2xl text-lime-500 font-bold mb-6">Create Schedule</h2>

          {error && (
            <div className="border-2 border-red-500 bg-red-900/20 p-4 rounded-lg mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="border-2 border-lime-500 bg-lime-900/20 p-4 rounded-lg mb-6">
              <p className="text-lime-400">Schedule created successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wake & Sleep Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lime-500 text-sm mb-2">Wake Time</label>
                <input
                  type="time"
                  value={wake}
                  onChange={(e) => setWake(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border-2 border-lime-500 text-lime-500 rounded-lg focus:outline-none focus:bg-lime-500/10"
                />
              </div>
              <div>
                <label className="block text-lime-500 text-sm mb-2">Sleep Time</label>
                <input
                  type="time"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border-2 border-lime-500 text-lime-500 rounded-lg focus:outline-none focus:bg-lime-500/10"
                />
              </div>
            </div>

            {/* Monster Count */}
            <div>
              <label className="block text-lime-500 text-sm mb-2">Monster Count</label>
              <input
                type="number"
                min="0"
                value={monsterCount}
                onChange={(e) => setMonsterCount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-transparent border-2 border-lime-500 text-lime-500 rounded-lg focus:outline-none focus:bg-lime-500/10"
              />
            </div>

            {/* Tasks */}
            <div className="border-t-2 border-lime-500/30 pt-6">
              <h3 className="text-lime-500 font-bold mb-4">Tasks</h3>

              {tasks.length > 0 && (
                <div className="space-y-2 mb-4">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-lime-500/10 p-3 rounded-lg border border-lime-500/30"
                    >
                      <span className="text-lime-500 text-sm">
                        {task.start} → {task.end}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(index)}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="time"
                    value={newTaskStart}
                    onChange={(e) => setNewTaskStart(e.target.value)}
                    placeholder="Start"
                    className="w-full px-4 py-2 bg-transparent border-2 border-lime-500 text-lime-500 rounded-lg focus:outline-none focus:bg-lime-500/10"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={newTaskEnd}
                    onChange={(e) => setNewTaskEnd(e.target.value)}
                    placeholder="End"
                    className="w-full px-4 py-2 bg-transparent border-2 border-lime-500 text-lime-500 rounded-lg focus:outline-none focus:bg-lime-500/10"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddTask}
                disabled={!newTaskStart || !newTaskEnd}
                className="w-full px-4 py-2 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors disabled:opacity-50"
              >
                Add Task
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Schedule"}
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="bg-black/40 border-2 border-lime-500 rounded-lg p-8">
          <h2 className="text-2xl text-lime-500 font-bold mb-6">Schedule History</h2>

          {/* Sort */}
          <div className="mb-6">
            <label className="block text-lime-500 text-sm mb-2">Sort</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "asc" | "desc");
                setPage(1);
              }}
              className="w-full px-4 py-2 bg-transparent border-2 border-lime-500 text-lime-500 rounded-lg focus:outline-none focus:bg-lime-500/10"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {/* History Table */}
          {historyLoading ? (
            <p className="text-lime-500 text-center py-8">Loading history...</p>
          ) : history.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-lime-500">
                      <th className="text-lime-500 text-left py-2 px-2">Wake</th>
                      <th className="text-lime-500 text-left py-2 px-2">Sleep</th>
                      <th className="text-lime-500 text-left py-2 px-2">Monsters</th>
                      <th className="text-lime-500 text-left py-2 px-2">Sessions</th>
                      <th className="text-lime-500 text-left py-2 px-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedSchedule(item)}
                        className="border-b border-lime-500/30 hover:bg-lime-500/5 cursor-pointer"
                      >
                        <td className="text-lime-500/70 py-3 px-2 text-sm">
                          {item.wake_time}
                        </td>
                        <td className="text-lime-500/70 py-3 px-2 text-sm">
                          {item.sleep_time}
                        </td>
                        <td className="text-lime-500/70 py-3 px-2 text-sm">{item.desired_count}</td>
                        <td className="text-lime-500/70 py-3 px-2 text-sm">{item.sessions_count}</td>
                        <td className="text-lime-500/70 py-3 px-2 text-sm">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <span className="text-lime-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-lime-500/50 text-center py-8">No schedules yet</p>
          )}
        </div>
      </div>

      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setSelectedSchedule(null)}>
          <div
            className="bg-black/80 border-2 border-lime-500 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-lime-500 font-bold">Schedule Details</h2>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="text-lime-500 hover:text-lime-400 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {detailsLoading ? (
              <p className="text-lime-500 text-center py-8">Loading details...</p>
            ) : selectedScheduleDetails ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                {selectedScheduleDetails.planner && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4">
                      <label className="text-lime-500/70 text-xs">Covered Hours</label>
                      <p className="text-lime-500 font-mono text-lg">{selectedScheduleDetails.planner.covered_hours}h</p>
                    </div>
                    <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4">
                      <label className="text-lime-500/70 text-xs">Effectiveness</label>
                      <p className="text-lime-500 font-mono text-lg">{selectedScheduleDetails.planner.effectiveness}/10</p>
                    </div>
                    <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4">
                      <label className="text-lime-500/70 text-xs">Monsters</label>
                      <p className="text-lime-500 font-mono text-lg">{selectedScheduleDetails.desired_count}</p>
                    </div>
                  </div>
                )}

                {/* Drinking Schedule */}
                {selectedScheduleDetails.planner && selectedScheduleDetails.planner.drink_sessions && selectedScheduleDetails.planner.drink_sessions.length > 0 && (
                  <div>
                    <h3 className="text-lime-500 font-bold mb-4 text-sm">🧋 DRINKING SCHEDULE</h3>
                    <div className="space-y-2">
                      {selectedScheduleDetails.planner.drink_sessions.map((session, index) => {
                        const startTime = session.start.split("T")[1]?.slice(0, 5) || session.start;
                        return (
                          <div key={index} className="relative">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-16">
                                <p className="text-lime-500 text-sm font-mono font-bold">{startTime}</p>
                              </div>
                              <div className="flex-1 bg-lime-500/30 border-l-4 border-lime-500 rounded-r-lg p-3">
                                <p className="text-lime-500 font-bold text-sm">Drink Monster</p>
                                <p className="text-lime-500/70 text-xs">{session.end} drink(s)</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div className="bg-lime-500/5 border border-lime-500/20 rounded-lg p-4">
                  <label className="text-lime-500/70 text-sm">Created</label>
                  <p className="text-lime-500 font-mono">
                    {new Date(selectedScheduleDetails.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Tasks */}
                {selectedScheduleDetails.tasks && selectedScheduleDetails.tasks.length > 0 && (
                  <div>
                    <h3 className="text-lime-500 font-bold mb-4 text-sm">SCHEDULED TASKS</h3>
                    <div className="space-y-2">
                      {selectedScheduleDetails.tasks.map((task) => {
                        const startTime = task.start_time.split("T")[1]?.slice(0, 5) || task.start_time;
                        const endTime = task.end_time.split("T")[1]?.slice(0, 5) || task.end_time;
                        return (
                          <div key={task.id} className="relative">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-16">
                                <p className="text-lime-500/70 text-xs font-mono">{startTime}</p>
                              </div>
                              <div className="flex-1 bg-lime-500/20 border-l-2 border-lime-500 rounded-r-lg p-3">
                                <p className="text-lime-500 font-bold text-sm">{task.title}</p>
                                <p className="text-lime-500/70 text-xs">
                                  {startTime} → {endTime}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-lime-500/50 text-center py-8">No details available</p>
            )}

            <button
              onClick={() => setSelectedSchedule(null)}
              className="w-full mt-6 px-4 py-2 border-2 border-lime-500 text-lime-500 font-bold rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => setDeleteConfirm(true)}
              className="w-full mt-2 px-4 py-2 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-black transition-colors"
            >
              Delete Plan
            </button>

            {deleteConfirm && (
              <div className="mt-4 p-4 border-2 border-red-500 bg-red-900/20 rounded-lg">
                <p className="text-red-400 mb-4">Are you sure you want to delete this plan? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeletePlan}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2 bg-red-500 text-black font-bold rounded-lg hover:bg-red-400 transition-colors disabled:opacity-50"
                  >
                    {deleteLoading ? "Deleting..." : "Confirm Delete"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Planner Result Modal */}
      {plannerResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setPlannerResult(null)}>
          <div
            className="bg-black/80 border-2 border-lime-500 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-lime-500 font-bold">Your Planned Schedule</h2>
              <button
                onClick={() => setPlannerResult(null)}
                className="text-lime-500 hover:text-lime-400 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Summary Stats */}
              {plannerResult.planner && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4">
                    <label className="text-lime-500/70 text-xs">Covered Hours</label>
                    <p className="text-lime-500 font-mono text-lg">{plannerResult.planner.covered_hours}h</p>
                  </div>
                  <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4">
                    <label className="text-lime-500/70 text-xs">Effectiveness</label>
                    <p className="text-lime-500 font-mono text-lg">{plannerResult.planner.effectiveness}/10</p>
                  </div>
                  <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4">
                    <label className="text-lime-500/70 text-xs">Monsters</label>
                    <p className="text-lime-500 font-mono text-lg">{plannerResult.desired_count}</p>
                  </div>
                </div>
              )}

              {/* Drinking Schedule */}
              {plannerResult.planner && plannerResult.planner.drink_sessions && plannerResult.planner.drink_sessions.length > 0 && (
                <div>
                  <h3 className="text-lime-500 font-bold mb-4 text-sm">🧋 DRINKING SCHEDULE</h3>
                  <div className="space-y-2">
                    {plannerResult.planner.drink_sessions.map((session, index) => {
                      const startTime = session.start.split("T")[1]?.slice(0, 5) || session.start;
                      return (
                        <div key={index} className="relative">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-16">
                              <p className="text-lime-500 text-sm font-mono font-bold">{startTime}</p>
                            </div>
                            <div className="flex-1 bg-lime-500/30 border-l-4 border-lime-500 rounded-r-lg p-3">
                              <p className="text-lime-500 font-bold text-sm">Drink Monster</p>
                              <p className="text-lime-500/70 text-xs">{session.end} drink(s)</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="bg-lime-500/5 border border-lime-500/20 rounded-lg p-4">
                <label className="text-lime-500/70 text-sm">Created</label>
                <p className="text-lime-500 font-mono">
                  {new Date(plannerResult.created_at).toLocaleString()}
                </p>
              </div>

              {/* Tasks */}
              {plannerResult.tasks && plannerResult.tasks.length > 0 && (
                <div>
                  <h3 className="text-lime-500 font-bold mb-4 text-sm">SCHEDULED TASKS</h3>
                  <div className="space-y-2">
                    {plannerResult.tasks.map((task) => {
                      const startTime = task.start_time.split("T")[1]?.slice(0, 5) || task.start_time;
                      const endTime = task.end_time.split("T")[1]?.slice(0, 5) || task.end_time;
                      return (
                        <div key={task.id} className="relative">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-16">
                              <p className="text-lime-500/70 text-xs font-mono">{startTime}</p>
                            </div>
                            <div className="flex-1 bg-lime-500/20 border-l-2 border-lime-500 rounded-r-lg p-3">
                              <p className="text-lime-500 font-bold text-sm">{task.title}</p>
                              <p className="text-lime-500/70 text-xs">
                                {startTime} → {endTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setPlannerResult(null)}
              className="w-full mt-6 px-4 py-2 bg-lime-500 text-black font-bold rounded-lg hover:bg-lime-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Planner() {
  return (
    <ProtectedRoute requireAuth={true}>
      <PlannerPage />
    </ProtectedRoute>
  );
}
