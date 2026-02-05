import React, { useState, useEffect, useRef } from "react";
import {
	Calendar,
	Settings,
	Layout,
	Truck,
	Wifi,
	ShieldCheck,
	Clock,
	Info,
	Smartphone,
	ClipboardList,
	Printer,
	ChevronRight,
	RefreshCcw,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { Chart as ChartJS, registerables } from "chart.js";

// Register all Chart.js components including controllers (bar, doughnut, etc.)
ChartJS.register(...registerables);

const projectData = [
	{
		id: 1,
		category: "Initiation",
		name: "Project Set-up & Governance",
		start: "2026-01-07",
		end: "2026-01-24",
		owner: "PM / Lead Dev",
		deliverables: ["Repo Setup", "CI/CD", "Tech Stack", "Governance"],
		desc: "Establishing the operational foundation and technical environment setup.",
		color: "#475569",
		type: "Management",
	},
	{
		id: 2,
		category: "Design",
		name: "UI/UX Design Management",
		start: "2026-01-20",
		end: "2026-02-14",
		owner: "PM / Designer",
		deliverables: ["Wireframes", "Mockups", "Design System"],
		desc: "High-fidelity visual design for Web and Mobile platforms.",
		color: "#db2777",
		type: "Design",
	},
	{
		id: 3,
		category: "Mobile",
		name: "Mobile UI Development",
		start: "2026-01-19",
		end: "2026-02-26",
		owner: "Mobile Dev",
		deliverables: ["App Shell", "Booking Screens", "Profile UI"],
		desc: "Android view logic and component construction.",
		color: "#f97316",
		type: "Dev",
	},
	{
		id: 4,
		category: "Backend",
		name: "Core Backend Development",
		start: "2026-02-03",
		end: "2026-03-28",
		owner: "Backend Dev",
		deliverables: ["DB Schema", "Auth System", "TukuPay Integration"],
		desc: "Primary logic, security, and integration architecture.",
		color: "#2563eb",
		type: "Dev",
	},
	{
		id: 5,
		category: "Web",
		name: "Web Admin Dashboards",
		start: "2026-02-10",
		end: "2026-03-21",
		owner: "Frontend Dev",
		deliverables: ["User Mgmt", "Real-time Map", "Reports"],
		desc: "Portals for system oversight and owner visibility.",
		color: "#7c3aed",
		type: "Dev",
	},
	{
		id: 6,
		category: "IoT",
		name: "GPS & Sensor Integration",
		start: "2026-02-10",
		end: "2026-03-21",
		owner: "Hardware/Backend",
		deliverables: ["GPS Ingestion", "Tank Sensor Logic", "Alerts"],
		desc: "Connecting physical hardware trackers to the platform.",
		color: "#10b981",
		type: "IoT",
	},
	{
		id: 7,
		category: "Mobile",
		name: "API & Mobile Integration",
		start: "2026-03-02",
		end: "2026-03-26",
		owner: "Mobile Dev",
		deliverables: ["Live Data", "Push Notify", "Map Sync"],
		desc: "Binding mobile views to live platform services.",
		color: "#ea580c",
		type: "Dev",
	},
	{
		id: 8,
		category: "QA",
		name: "QA & Integration Testing",
		start: "2026-03-03",
		end: "2026-03-28",
		owner: "PM / QA",
		deliverables: ["Test Plans", "Bug Registry", "UAT Prep"],
		desc: "Comprehensive stabilization and defect resolution.",
		color: "#e11d48",
		type: "QA",
	},
	{
		id: 9,
		category: "UAT",
		name: "User Acceptance Testing",
		start: "2026-04-01",
		end: "2026-04-18",
		owner: "Stakeholders",
		deliverables: ["UAT Sign-off", "Feedback Consolidation"],
		desc: "Stakeholder validation in staging environment.",
		color: "#be123c",
		type: "QA",
	},
	{
		id: 10,
		category: "Launch",
		name: "Release & Project Closure",
		start: "2026-04-14",
		end: "2026-04-30",
		owner: "Full Team",
		deliverables: [
			"Production Deployment",
			"User Manuals",
			"Project Closure Report",
			"Handover Keys",
		],
		desc: "Final production release and asset transfer.",
		color: "#0f172a",
		type: "Management",
	},
];

const baseDate = new Date("2026-01-01");
const daysSinceBase = (dateStr) =>
	(new Date(dateStr) - baseDate) / (1000 * 60 * 60 * 24);

// Helper to get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
const getOrdinalSuffix = (day) => {
	if (day > 3 && day < 21) return "th";
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
};

// Format date as "7th Jan"
const formatReadableDate = (date) => {
	const day = date.getDate();
	const month = date.toLocaleDateString("en-US", { month: "short" });
	return `${day}${getOrdinalSuffix(day)} ${month}`;
};

const dateFromDays = (days) => {
	const d = new Date(baseDate);
	d.setDate(d.getDate() + days);
	return formatReadableDate(d);
};

const App = () => {
	const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
	const [filterType, setFilterType] = useState("all");
	const ganttRef = useRef(null);
	const doughnutRef = useRef(null);
	const reportRef = useRef(null);
	const ganttInstance = useRef(null);
	const doughnutInstance = useRef(null);

	const selectedTask = projectData[selectedTaskIndex];
	const filteredData =
		filterType === "all"
			? projectData
			: projectData.filter(
					(t) =>
						t.type === filterType ||
						t.category === filterType ||
						(filterType === "Dev" &&
							["Dev", "Mobile", "Web", "Backend"].includes(t.type)),
				);

	useEffect(() => {
		if (ganttInstance.current) {
			ganttInstance.current.destroy();
		}

		if (ganttRef.current) {
			const ctx = ganttRef.current.getContext("2d");
			ganttInstance.current = new ChartJS(ctx, {
				type: "bar",
				data: {
					labels: filteredData.map((t) => t.name),
					datasets: [
						{
							data: filteredData.map((t) => [
								daysSinceBase(t.start),
								daysSinceBase(t.end),
							]),
							backgroundColor: filteredData.map((t) => t.color),
							borderRadius: 4,
							barPercentage: 0.7,
						},
					],
				},
				options: {
					indexAxis: "y",
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						x: {
							min: 0,
							max: 125,
							grid: { color: "#f1f5f9" },
							ticks: { callback: (v) => dateFromDays(v), font: { size: 10 } },
						},
						y: {
							grid: { display: false },
							ticks: { font: { weight: "bold", size: 11 } },
						},
					},
					plugins: {
						legend: { display: false },
						tooltip: {
							callbacks: {
								label: (c) => {
									const val = c.raw;
									return `${dateFromDays(val[0])} - ${dateFromDays(val[1])}`;
								},
							},
						},
					},
					onClick: (e, els) => {
						if (els.length > 0) {
							const clickedLabel = filteredData[els[0].index].name;
							const originalIndex = projectData.findIndex(
								(t) => t.name === clickedLabel,
							);
							setSelectedTaskIndex(originalIndex);
						}
					},
				},
			});
		}

		return () => {
			if (ganttInstance.current) ganttInstance.current.destroy();
		};
	}, [filteredData]);

	useEffect(() => {
		if (doughnutInstance.current) {
			doughnutInstance.current.destroy();
		}

		if (doughnutRef.current) {
			const ctx = doughnutRef.current.getContext("2d");
			doughnutInstance.current = new ChartJS(ctx, {
				type: "doughnut",
				data: {
					labels: ["Backend", "Web", "Mobile", "IoT", "QA"],
					datasets: [
						{
							data: [30, 15, 20, 20, 15],
							backgroundColor: [
								"#2563eb",
								"#7c3aed",
								"#f97316",
								"#10b981",
								"#e11d48",
							],
							borderWidth: 0,
							hoverOffset: 4,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: "75%",
					plugins: { legend: { display: false } },
				},
			});
		}

		return () => {
			if (doughnutInstance.current) doughnutInstance.current.destroy();
		};
	}, []);

	const handlePrint = () => {
		// Standard approach to focus printing on a specific container
		window.print();
	};

	const stats = [
		{
			label: "Timeline",
			val: "16 Weeks",
			Icon: Calendar,
			color: "text-slate-600",
		},
		{
			label: "Workstreams",
			val: "5 Active",
			Icon: RefreshCcw,
			color: "text-blue-600",
		},
		{
			label: "Deliverables",
			val: "28 Items",
			Icon: ClipboardList,
			color: "text-purple-600",
		},
		{
			label: "Go-Live",
			val: "Apr 30",
			Icon: CheckCircle2,
			color: "text-emerald-600",
		},
	];

	return (
		<div className="min-h-screen bg-slate-50 text-slate-800 font-sans print:bg-white print:text-black">
			{/* Target Content Capture via Print Media */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
        @media print {
          @page { size: A4; margin: 15mm; }
          body * { visibility: hidden; }
          #report-content-area, #report-content-area * { visibility: visible; }
          #report-content-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            margin: 0;
            padding: 0;
          }
          .no-print { display: none !important; }
          .print-break-inside-avoid { page-break-inside: avoid; }
          .chart-container { height: 350px !important; }
          .bg-white, .bg-slate-50 { background-color: transparent !important; border: 1px solid #e2e8f0 !important; }
          .rounded-2xl { border-radius: 0.5rem !important; }
        }
      `,
				}}
			/>

			{/* Navigation */}
			<nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
								<ShieldCheck size={20} />
							</div>
							<div>
								<h1 className="text-lg font-bold text-slate-900 leading-tight">
									Septiq Project Hub
								</h1>
								<p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
									Management System
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<button
								onClick={handlePrint}
								className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition shadow-sm"
							>
								<Printer size={16} />
								<span className="hidden sm:inline">Download PDF</span>
							</button>
							<button
								onClick={() => {
									setFilterType("all");
									setSelectedTaskIndex(0);
								}}
								className="p-2 text-slate-400 hover:text-blue-600 transition"
								title="Reset View"
							>
								<RefreshCcw size={18} />
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content Wrap for Printing */}
			<main
				id="report-content-area"
				ref={reportRef}
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
			>
				{/* Print Header */}
				<div className="hidden print:block text-center border-b-2 border-slate-900 pb-6 mb-8">
					<h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">
						Septiq Master Project Report
					</h1>
					<p className="text-lg font-bold text-slate-600">
						Platform Development Strategy 2026
					</p>
					<p className="text-xs text-slate-400 mt-2">
						Report Date: {new Date().toLocaleDateString()}
					</p>
				</div>

				{/* Hero Section */}
				<section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 print-break-inside-avoid">
					<div className="flex items-start gap-4 mb-6">
						<div className="p-3 bg-blue-50 rounded-xl text-blue-600 no-print">
							<Info size={24} />
						</div>
						<div>
							<h2 className="text-lg font-bold text-slate-900">
								Executive Summary
							</h2>
							<p className="text-slate-600 text-sm leading-relaxed max-w-4xl mt-1">
								The Septiq development roadmap utilizes a synchronized
								multi-track approach for 2026. This ensures backend services are
								built concurrently with IoT sensor ingestion and mobile
								interface logic, targeting a full system stabilization by
								mid-April 2026.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{stats.map((stat, i) => (
							<div
								key={i}
								className="bg-slate-50 p-4 rounded-xl border border-slate-200"
							>
								<p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1">
									<stat.Icon size={14} /> {stat.label}
								</p>
								<p className={`text-xl font-bold mt-1 ${stat.color}`}>
									{stat.val}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Gantt Chart Section */}
				<section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 print-break-inside-avoid">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
						<div>
							<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
								<Clock size={20} className="text-blue-600" />
								Master Project Timeline (2026)
							</h3>
							<p className="text-xs text-slate-500 font-medium no-print">
								Click on a bar to see phase-specific deliverables
							</p>
						</div>
						<div className="flex flex-wrap gap-2 no-print">
							{["all", "Dev", "IoT", "QA"].map((type) => (
								<button
									key={type}
									onClick={() => setFilterType(type)}
									className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition border ${
										filterType === type
											? "bg-slate-900 text-white border-slate-900"
											: "bg-white text-slate-500 border-slate-200 hover:border-blue-400"
									}`}
								>
									{type}
								</button>
							))}
						</div>
					</div>

					<div className="h-[450px] chart-container relative">
						<canvas ref={ganttRef}></canvas>
					</div>
				</section>

				{/* Details & Doughnut Split */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Detail Panel */}
					<div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 print-break-inside-avoid">
						<div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
							<div>
								<span
									className="text-[10px] font-black uppercase tracking-widest block mb-1"
									style={{ color: selectedTask.color }}
								>
									{selectedTask.category}
								</span>
								<h3 className="text-xl font-bold text-slate-900">
									{selectedTask.name}
								</h3>
							</div>
							<div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 border border-slate-200">
								{formatReadableDate(new Date(selectedTask.start))} —{" "}
								{formatReadableDate(new Date(selectedTask.end))}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-4">
								<div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
										<AlertCircle size={14} /> Description
									</h4>
									<p className="text-sm text-slate-600 leading-relaxed">
										{selectedTask.desc}
									</p>
								</div>
								<div className="flex items-center gap-2 text-xs font-medium text-slate-500">
									<span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">
										Responsibility:
									</span>
									<span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
										{selectedTask.owner}
									</span>
								</div>
							</div>

							<div>
								<h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
									Core Deliverables
								</h4>
								<ul className="space-y-3">
									{selectedTask.deliverables.map((item, i) => (
										<li
											key={i}
											className="flex items-start gap-3 text-sm text-slate-600"
										>
											<div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
												{i + 1}
											</div>
											{item}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					{/* Effort Distribution */}
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 print-break-inside-avoid">
						<h3 className="text-lg font-bold text-slate-900 mb-2">
							Effort Split
						</h3>
						<p className="text-xs text-slate-400 font-medium mb-6 uppercase tracking-wider">
							Resources by Track
						</p>
						<div className="h-48 relative mb-8">
							<canvas ref={doughnutRef}></canvas>
						</div>
						<div className="space-y-3">
							{[
								{
									label: "Backend Architecture",
									color: "bg-blue-600",
									p: "30%",
								},
								{ label: "Mobile UX/UI", color: "bg-orange-500", p: "20%" },
								{
									label: "IoT/GPS Integration",
									color: "bg-emerald-500",
									p: "20%",
								},
								{ label: "QA & Compliance", color: "bg-rose-500", p: "15%" },
							].map((item, i) => (
								<div
									key={i}
									className="flex items-center justify-between text-xs"
								>
									<div className="flex items-center gap-2">
										<div className={`w-2 h-2 rounded-full ${item.color}`} />
										<span className="text-slate-600 font-medium">
											{item.label}
										</span>
									</div>
									<span className="font-bold text-slate-900">{item.p}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Deliverables Table */}
				<section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 print-break-inside-avoid">
					<div className="p-6 border-b border-slate-100">
						<h3 className="text-lg font-bold text-slate-900">
							Project Register (Appendix A)
						</h3>
						<p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
							Full task and deliverable inventory
						</p>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full text-left text-sm">
							<thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
								<tr>
									<th className="px-6 py-4">Phase</th>
									<th className="px-6 py-4">Task Name</th>
									<th className="px-6 py-4">Owner</th>
									<th className="px-6 py-4">Timeline</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{projectData.map((task, i) => (
									<tr
										key={task.id}
										className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedTaskIndex === i ? "bg-blue-50/50" : ""}`}
										onClick={() => setSelectedTaskIndex(i)}
									>
										<td className="px-6 py-4">
											<span
												className="text-[10px] font-bold uppercase px-2 py-1 rounded-md border"
												style={{
													color: task.color,
													borderColor: task.color + "40",
												}}
											>
												{task.category}
											</span>
										</td>
										<td className="px-6 py-4 font-bold text-slate-700">
											{task.name}
										</td>
										<td className="px-6 py-4 text-xs text-slate-500 font-medium">
											{task.owner}
										</td>
										<td className="px-6 py-4 text-xs font-mono text-slate-400">
											{formatReadableDate(new Date(task.start))} -{" "}
											{formatReadableDate(new Date(task.end))}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-white border-t border-slate-200 py-10 no-print">
				<div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px] font-bold">
							S
						</div>
						<span className="text-sm font-bold text-slate-900">
							Septiq Platform Documentation
						</span>
					</div>
					<p className="text-xs text-slate-400 font-medium">
						© 2026 Project Management Group. Confidential Artifact.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default App;
