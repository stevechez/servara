// components/jobs/JobDetailModal.tsx
import { Button } from '@/components/ui/button';
import { CheckCircle, MapPin, Phone, Camera } from 'lucide-react';
import { completeJobAction } from '@/lib/actions/jobs';

// 1. Define the shape of your data
interface Photo {
	id: string;
	url: string;
}

interface Job {
	id: string;
	customer_name: string;
	address: string;
	phone: string;
	status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
	photos?: Photo[];
}

interface JobDetailModalProps {
	job: Job;
	onClose: () => void; // A function that returns nothing
}

// 2. Apply the interface to your props
export function JobDetailModal({ job, onClose }: JobDetailModalProps) {
	return (
		<div className="p-6 space-y-6">
			{/* Header: Customer & Address */}
			<section>
				<div className="flex justify-between items-start">
					<h2 className="text-2xl font-bold">{job.customer_name}</h2>
					{/* Add a close button that calls onClose */}
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						&times;
					</button>
				</div>

				<div className="flex items-center text-muted-foreground mt-2">
					<MapPin className="w-4 h-4 mr-2" />
					<a
						href={`https://maps.apple.com/?q=${encodeURIComponent(job.address)}`}
						className="underline"
					>
						{job.address}
					</a>
				</div>
				<div className="flex items-center text-muted-foreground mt-1">
					<Phone className="w-4 h-4 mr-2" />
					<a href={`tel:${job.phone}`}>{job.phone}</a>
				</div>
			</section>

			{/* Job Photos Section */}
			<section>
				<h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
					Photos
				</h3>
				<div className="grid grid-cols-3 gap-2 mt-2">
					{job.photos?.map(p => (
						<img
							key={p.id}
							src={p.url}
							alt="Job photo"
							className="rounded-md aspect-square object-cover"
						/>
					))}
					<Button
						variant="outline"
						className="aspect-square flex flex-col items-center justify-center border-dashed"
					>
						<Camera className="w-6 h-6" />
						<span className="text-[10px] mt-1">Add Photo</span>
					</Button>
				</div>
			</section>

			{/* Primary Actions */}
			<div className="flex flex-col gap-3 pt-4">
				{job.status !== 'completed' && (
					<Button
						size="lg"
						className="w-full bg-green-600 hover:bg-green-700 text-white"
						onClick={async () => {
							await completeJobAction(job.id);
							onClose(); // Optionally close modal after completing
						}}
					>
						<CheckCircle className="w-5 h-5 mr-2" />
						Mark Job Complete
					</Button>
				)}
				<Button variant="secondary" size="lg" className="w-full">
					Create Invoice
				</Button>
			</div>
		</div>
	);
}
