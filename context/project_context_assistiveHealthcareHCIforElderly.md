Project Context: Assistive Healthcare HCI for Elderly Users
===========================================================

1\. Project Overview
--------------------

This project focuses on improving the accessibility of public digital services in Italy for the elderly population (aged 65+). Specifically, we are designing and evaluating Human-Computer Interaction (HCI) solutions for two critical platforms:

*   **CUP (Centro Unico di Prenotazione):** Booking healthcare appointments and exams.
    
*   **PagoPA:** Paying public administration bills and healthcare fees.
    

The ultimate goal is to reduce digital exclusion and "techno-stress" by providing a supportive interface that builds user confidence.

2\. Phase 1: Context of Use & User Research
-------------------------------------------

Through interviews and observations, we identified key characteristics of our target demographic:

*   **Emotional State:** High anxiety regarding digital mistakes, often leading to "self-blame" or total delegation of tasks to younger family members.
    
*   **Physical Environment:** Tests are conducted in domestic settings (living rooms/kitchens) to maintain ecological validity.
    
*   **Existing Habits:** Heavy reliance on paper-based reminders (manuals, post-its) and PC usage over smartphones for "serious" tasks.
    

Key Personas:

*   **Rosa (The Self-Blaming Novice):** High anxiety, fears "breaking" the system, needs constant reassurance.
    
*   **Antonio (The Proud Delegator):** Competent in specific routines but delegates anything new; values efficiency but fears losing control.
    

3\. Phase 2: Low-Fidelity Prototyping
-------------------------------------

We developed and compared two distinct design philosophies:

*   **Design A: Digital Gym:** A "sandbox" approach where users practice tasks in a safe environment with immediate feedback (Level 0) before performing the real action.
    
*   **Design B: Interactive Mentor:** A support-oriented system that provides real-time, context-aware guidance via a secondary device (dual-device setup).
    

4\. Usability Testing Results (Lo-Fi)
-------------------------------------

We conducted 6 testing sessions (P1-P6) in Turin and Milan.

*   **Effectiveness:** 100% success rate for both designs across both tasks.
    
*   **Efficiency:** The **Mentor** design generally resulted in fewer mistakes for complex data entry (e.g., finding the NRE code on a medical prescription).
    
*   **User Satisfaction (SUS):** Both prototypes scored ~80/100, indicating high usability.
    
*   **Qualitative Feedback:** Users found the "Digital Gym" smoother for interaction but highly valued the "Mentor's" clear, step-by-step visual scaffolding.
    

5\. Current Phase: High-Fidelity Development
--------------------------------------------

Based on the Lo-Fi evaluation, we are now developing the **Hi-Fi Prototype** with the following specifications:

*   **Selected Design:** **Interactive Mentor**.
    
*   **Platform Transition:** Moving from a dual-device setup to a **single-device Tablet Split-Screen**. This addresses the Lo-Fi feedback regarding the distraction of switching between two screens.
    
*   **Layout:** A 70/30 split screen where the service (CUP/PagoPA) occupies the main area and the Mentor provides contextual help, document zooms, and progress tracking in a lateral panel.
    
*   **HCI Focus:** Improving digital keyboard affordance and simplifying complex gestures like scrolling, which were identified as major pain points.
    

6\. Technical Stack & Deployment
--------------------------------

*   **Frontend:** Web-based application using **HTML5**, **CSS3**, and **JavaScript** (React/Vue).
    
*   **Interaction:** Native touch interaction optimized for tablet browsers.
    
*   **Deployment:** Automated CI/CD via **Vercel**, linked to the GitHub main branch.
    
*   **Testing Strategy:** Remote moderated testing in Italy using a "Local Facilitator" (proxy) to ensure touch-native interaction is observed via screen sharing and hand-cams.
    

7\. Key References in Repo
--------------------------

*   2 Plannning - context of use analysis.md: Initial research goals and constraints.
    
*   3 Results - context of use analysis.md: Detailed Persona profiles and task analysis.
    
*   4 Low fidelity prototypes and planning.md: Lo-Fi design viewpoints and evaluation strategy.
    
*   5 Usability testing report.md: Quantitative and qualitative results from the first testing cycle.
    

**Note for AI Collaborators:** When suggesting code or UI improvements, prioritize **clarity, high contrast, and large touch targets** to accommodate elderly users' visual and motor requirements.