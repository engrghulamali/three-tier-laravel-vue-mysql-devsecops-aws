import axios from 'axios';
import { defineStore } from 'pinia';

export const useFetchAppointments = defineStore({
    id: 'fetchAppointments',
    state: () => ({
        data: null,
        currentPage: null,
        itemsPerPage: null,
        totalPages: null,
        page: 1,
        searchedAppointments: null,
        searchQuery: null,
        totalAppointments: null,
        selectedAppointmentsByStatus: null,
        isLoading: true,
        successChangeStatus: null,
        countAllAppointments: 0,
        countAllPending: 0,
        countAllCompleted: 0,
        countAllCanceled: 0,
        countAllScheduled: 0,

    }),

    actions: {
        async fetchAppointments(page) {
            try {
                const response = await axios.get('/fetch-appointments', {
                    params: { page }
                });
                this.currentPage = response.data.current_page;
                this.itemsPerPage = response.data.per_page;
                this.totalPages = response.data.last_page;
                this.data = response.data.data;
                this.totalAppointments = response.data.data.length;
            } catch (error) {
                console.log(error);
            }
        },

        async fetchSearchedAppointments(page, searchQuery) {
            try {
                const response = await axios.get('/fetch-searched-appointments', {
                    params: { search_query: searchQuery, page }
                });
                this.totalAppointments = response.data.appointments.total;
                this.searchedAppointments = response.data.appointments.data;
                this.itemsPerPage = response.data.per_page;
                this.currentPage = response.data.current_page;
                this.totalPages = response.data.last_page;
            } catch (error) {
                console.log(error);
            }
        },

        async fetchAppointmentsByStatus(paymentStatus, page) {
            try {
                const response = await axios.get('/fetch-appointments-by-status', {
                    params: { paymentStatus: paymentStatus.toLowerCase(), page }
                });
                this.totalAppointments = response.data.appointments.total;
                this.selectedAppointmentsByStatus = response.data.appointments;
                this.itemsPerPage = response.data.per_page;
                this.currentPage = response.data.current_page;
                this.totalPages = response.data.last_page;
            } catch (error) {
                console.log(error);
            }
        },

        async fetchAppointmentsCount() {
            try {
                const response = await axios.get('/count-appointments');
                this.countAllAppointments = response.data.allAppointments;
                this.countAllPending = response.data.pendingAppointments;
                this.countAllCompleted = response.data.completedAppointments;
                this.countAllScheduled = response.data.scheduledAppointments
                this.countAllCanceled = response.data.canceledAppointments

            } catch (error) {
                console.log(error);
            }
        }
    }
});
