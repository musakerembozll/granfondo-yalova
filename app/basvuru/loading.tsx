import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function Loading() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <Navbar />
            <div className="flex-1 container px-4 py-32 max-w-3xl mx-auto">
                <div className="text-center">
                    <div className="animate-pulse">
                        <div className="h-10 bg-slate-800 rounded w-2/3 mx-auto mb-4"></div>
                        <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto"></div>
                    </div>
                    <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-10">
                        <div className="animate-pulse space-y-6">
                            <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-10 bg-slate-800 rounded"></div>
                                <div className="h-10 bg-slate-800 rounded"></div>
                            </div>
                            <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-10 bg-slate-800 rounded"></div>
                                <div className="h-10 bg-slate-800 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
