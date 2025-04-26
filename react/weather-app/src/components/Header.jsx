import React from 'react'
import '../index.css'

function Header() {
    return (
        <div>
            <div className="relative border-t border-gray-200 bg-gray-50">

                <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-12 sm:px-12 lg:pt-24">
                    <header className="mx-auto max-w-2xl text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Weather Reports</h1>
                        <p className="mt-2 text-sm font-semibold text-gray-400">
                            This app is made to help user find weather details in their city.
                        </p>
                    </header>
                </div>
            </div>
        </div>
    )
}

export default Header
