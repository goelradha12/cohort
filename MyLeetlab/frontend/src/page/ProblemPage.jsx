import { useEffect } from 'react'
import { useParams } from 'react-router';
import { useProblemStore } from '../store/useProblemStore';
import { Loader } from 'lucide-react';

const ProblemPage = () => {
    const { id } = useParams();
    const { isProblemLoading, problem, getProblemById } = useProblemStore();

    useEffect(() => {
        getProblemById(id)
        console.log(JSON.stringify(problem), problem)
    }, [id])

    if (isProblemLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        )
    }
    return (
        <div>
            Problem Page, {id}
        </div>
    )
}

export default ProblemPage
