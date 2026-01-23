export default function CssPage() {
    return (
        <div className="w-full h-screen">
            <div className="text-2xl font-bold mb-4 flex flex-1 items-center justify-center">等比练习 1</div>
            <div className="flex flex-row flex-1 bg-gray-200 h-40 mx-10">
                <div className="w-80 h-full bg-red-200 text-red-500 justify-center flex items-center">元素1</div>
                <div className="w-auto h-full bg-blue-200 text-blue-500 justify-center flex items-center flex-1">元素2</div>
                <div className="w-80 h-full bg-green-200 text-green-500 justify-center flex items-center">元素3</div>
            </div>

            <div className="text-2xl font-bold mb-4 flex flex-1 items-center justify-center">等比练习 2</div>
            <div className="flex flex-row flex-1 bg-gray-200 h-40 mx-10">
                <div className="h-full bg-red-200 text-red-500 justify-center flex-4 items-center">元素1</div>
                <div className="h-full bg-blue-200 text-blue-500 justify-center flex-1 items-center">元素2</div>
                <div className="h-full bg-green-200 text-green-500 justify-center flex-3 items-center">元素3</div>
            </div>
        </div>
    )
}