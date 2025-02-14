export default function LoadingButtion({ isSubmitting, label }: { isSubmitting: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white cursor-pointer bg-[#1e88e5] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#1e88e5] dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
            {isSubmitting ? <div className="w-full flex justify-center items-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div> : label}
        </button>
    )
}