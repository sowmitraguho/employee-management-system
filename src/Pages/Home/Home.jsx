import React from 'react';
import { Button } from "@/components/ui/button"

const Home = () => {
    return (
        <div>
            <h2 className="text-3xl">This is Home</h2>
            <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
        </div>
    );
};

export default Home;