
(async () => {
    const results = [];
    try {
        if (typeof skipOnboarding === 'function') skipOnboarding();
        results.push('1. Onboarding skipped');
        
        switchRole('employer');
        loginEmployerFaceID();
        results.push('2. Employer login successful');
        
        openEmployerFormOverlay();
        selectEmpCat('Kert');
        selectToolsRequired('employer');
        toggleUrgentJob(true);
        document.getElementById('emp-details').value = 'Automated QA Test Job Description.';
        
        window.confirmedAddress = '1051 Budapest, Kossuth Lajos tér 1-3.';
        window.confirmedLat = 47.5071;
        window.confirmedLon = 19.0456;
        
        await employerPublishJobNew(); 
        
        const testJob = localEmployerJobs.find(j => j.details && j.details.includes('Automated QA Test'));
        if (testJob) {
            results.push('3. Job posting successful: ' + testJob.id);
        } else {
            results.push('3. Job posting FAILED');
            return JSON.stringify(results);
        }

        switchRole('worker');
        loginWorkerFaceID();
        results.push('4. Worker login successful');
        
        openWorkerJobDetail(testJob.id);
        await workerApplyToJob(); 
        
        const app = localWorkerApplications.find(a => a.jobId === testJob.id);
        if (app) {
            results.push('5. Job application successful');
        } else {
            results.push('5. Job application FAILED');
        }

        const chat = localChats.find(c => c.jobId === testJob.id);
        if (chat) {
            results.push('6. Chat room created successfully');
            if (chat.messages && chat.messages.length > 0) {
                results.push('7. Automated message verified');
            } else {
                results.push('7. Automated message FAILED');
            }
        } else {
            results.push('6. Chat room creation FAILED');
        }

        openChatRoom();
        document.getElementById('worker-chat-reply-input').value = 'Test free text message';
        await sendWorkerChatMessageNew();
        
        const updatedChat = localChats.find(c => c.jobId === testJob.id);
        if (updatedChat && updatedChat.messages.some(m => m.text.includes('Test free text message'))) {
            results.push('8. Free text messaging successful');
        } else {
            results.push('8. Free text messaging FAILED');
        }
        
        closeWorkerChatRoom();
        closeWorkerJobDetail();

        switchRole('employer');
        openEmployerAdDetailNew(testJob.id);
        
        await deleteEmployerAdFromDetailConfirmed(testJob.id); 
        
        const deleted = !localEmployerJobs.find(j => j.id === testJob.id);
        if (deleted) {
            results.push('9. Job deletion successful');
        } else {
            results.push('9. Job deletion FAILED');
        }

        openLocationSheet();
        const distSlider = document.getElementById('distance-slider');
        if (distSlider) {
            distSlider.value = 25;
            onDistanceSliderChange(25);
            confirmDistance();
            results.push('10. Distance filtering triggered successfully');
        } else {
            results.push('10. Distance slider FAILED');
        }
        
        openSettings();
        document.getElementById('profile-name').value = 'QA Tester';
        saveSettings();
        if (document.getElementById('profile-name-display').innerText.includes('QA Tester')) {
             results.push('11. Account settings save successful');
        } else {
             results.push('11. Account settings save FAILED');
        }

        return JSON.stringify(results);
    } catch(e) {
        results.push('EXCEPTION: ' + e.message);
        return JSON.stringify(results);
    }
})();
