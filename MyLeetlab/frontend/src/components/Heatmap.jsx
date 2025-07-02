const Heatmap = ({ allDates }) => {
    // Convert date to 'YYYY-MM-DD'
    const getDateKey = ({ year, month, day }) => {
        const date = new Date(`${month} ${day}, ${year}`);
        return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    };

    // Count submissions per date
    const counts = allDates.reduce((acc, dateObj) => {
        const key = getDateKey(dateObj);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    // get level from counts of submissions
    const getLevel = (count) => {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count === 2) return 2;
        if (count === 3) return 3;
        return 4;
    };

    let currentYear = new Date().getFullYear();

    const generateDateGrid = (startDate = new Date(currentYear, 0, 1)) => {
        const dates = [];
        const currentDate = new Date(startDate);

        // Go back to the previous Sunday to align like GitHub
        const dayOfWeek = currentDate.getDay();
        currentDate.setDate(currentDate.getDate() - dayOfWeek + 1);

        // 52 weeks * 7 days = 364 days + 7 margin days
        for (let i = 0; i < 371; i++) {
            const date = new Date(currentDate);
            const year = date.getFullYear();
            const month = date.toLocaleString("default", { month: "short" });
            const day = date.getDate();

            dates.push({ year, month, day });

            currentDate.setDate(currentDate.getDate() + 1); // Move one day next
        }

        // Reverse so it starts from oldest to newest
        return dates;
    };

    const allFullDates = generateDateGrid(); // From today back 364 days

    return (
        <ul className="squares">
            {allFullDates.map((dateObj, index) => {
                const dateKey = getDateKey(dateObj);
                const count = counts[dateKey] || 0;
                const level = getLevel(count);

                return (
                    <li
                        key={index}
                        data-level={level}
                        title={`${dateObj.day + " " + dateObj.month + ", " + dateObj.year
                            }: ${count} submission${count !== 1 ? "s" : ""}`}
                        className={`w-[15px] h-[15px] square border-1 ${level === 0
                                ? "bg-base-200"
                                : level === 1
                                    ? "bg-green-200"
                                    : level === 2
                                        ? "bg-green-400"
                                        : level === 3
                                            ? "bg-green-600"
                                            : "bg-green-800"
                            } border border-primary`}
                    ></li>
                );
            })}
        </ul>
    );
};

export default Heatmap;
