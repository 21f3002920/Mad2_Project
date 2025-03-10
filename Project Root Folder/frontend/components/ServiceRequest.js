export default {
    props: {
        serviceRequests: Array,
        role: String,
        handleAction: Function,
        showActions: { type: Boolean, default: true }
    },
    template: `
        <div>
            <div class="table">
                <h2>Service Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th v-if="role === 'Customer'">Professional</th>
                            <th v-if="role === 'Customer'">Phone</th>
                            <th v-if="role === 'Customer'">Pincode</th>
                            <th v-if="role === 'Professional'">Customer</th>
                            <th v-if="role === 'Professional'">Address</th>
                            <th v-if="role === 'Professional'">Phone</th>
                            <th>Created At</th>
                            <th>Closed At</th>
                            <th>Status</th>
                            <th v-if="showActions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="request in serviceRequests" :key="request.sr_id">
                            <td>{{ request.service_name }}</td>
                            <td v-if="role === 'Customer'">{{ request.professional_name }}</td>
                            <td v-if="role === 'Customer'">{{ request.professional_phone }}</td>
                            <td v-if="role === 'Customer'">{{ request.professional_pincode }}</td>
                            <td v-if="role === 'Professional'">{{ request.customer_name }}</td>
                            <td v-if="role === 'Professional'">{{ request.customer_address }}</td>
                            <td v-if="role === 'Professional'">{{ request.customer_phone }}</td>
                            <td>{{ request.sr_created_at }}</td>
                            <td>{{ request.sr_closed_at }}</td>
                            <td>{{ request.status }}</td>
                            <td v-if="showActions">
                                <div v-if="role === 'Customer' && (request.status === 'Accepted' || request.status === 'Closed by Professional')">
                                    <button class="logoutgreen" @click="handleAction(request.sr_id, 'Closed')">Close</button>
                                    <button class="logout">Contact Professional</button>
                                </div>
                                <div v-if="role === 'Customer' && request.status === 'Requested'">
                                    <button class="logoutred" @click="handleAction(request.sr_id, 'Cancel')">Cancel</button>
                                </div>
                                <div v-if="role === 'Professional' && request.status === 'Requested'">
                                    <button class="logoutgreen" @click="handleAction(request.sr_id, 'Accepted')">Accept</button>
                                    <button class="logoutred" @click="handleAction(request.sr_id, 'Rejected')">Reject</button>
                                </div>
                                <div v-if="role === 'Professional' && (request.status === 'Accepted' || request.status === 'Closed by Customer')">
                                    <button class="logoutgreen" @click="handleAction(request.sr_id, 'Close')">Close</button>
                                    <button class="logout">Contact Customer</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};
