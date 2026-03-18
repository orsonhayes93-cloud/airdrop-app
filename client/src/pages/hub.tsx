import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import HubConfig from '../hub-config';
import { ClaimButton } from '../components/ClaimButton';
import { WalletConnectModal } from '../components/WalletConnectModal';
import { motion } from 'framer-motion';

const HubPage = () => {
    const router = useRouter();
    const { hubId } = router.query;

    useEffect(() => {
        if (!hubId) return;
        // You can implement any logic you want with the hubId, e.g., fetching data
    }, [hubId]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-screen bg-gray-100"
        >
            <h1 className="text-4xl font-bold mb-4">Hub {hubId}</h1>
            <ClaimButton />
            <WalletConnectModal />
        </motion.div>
    );
};

export default HubPage;
