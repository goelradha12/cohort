import React from "react";
import { CreateProblemSchema } from "../validators/problemForm.validators.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const CreateProblemForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(CreateProblemSchema) });

    const onSubmit = (data) => {
        console.log(data);
    };
    return <div>Create Problem</div>;
};

export default CreateProblemForm;
