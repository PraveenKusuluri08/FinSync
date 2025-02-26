export default function LoadingButtion({ isSubmitting, label }: { isSubmitting: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="hover:bg-[#1664C0] bg-[#1976d2] text-sm uppercase text-white p-2 rounded w-full"
        >
            {isSubmitting ? <div className="w-full flex justify-center items-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div> : label}
        </button>
    )
}