    /* eslint-disable @typescript-eslint/no-explicit-any */
    "use client";

    import { createContext, useContext, useState, ReactNode } from "react";


    type InterviewContextType = {
    interviewInfo: any;
    setInterviewInfo: (info: any) => void;
    };

    // 2. Create context
    const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

    // 3. Provider component
    export const InterviewProvider = ({ children }: { children: ReactNode }) => {
    const [interviewInfo, setInterviewInfo] = useState<any>(null);

    return (
        <InterviewContext.Provider value={{ interviewInfo, setInterviewInfo }}>
        {children}
        </InterviewContext.Provider>
    );
    };

    // 4. Custom hook for consuming context
    export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    return context;
    };
