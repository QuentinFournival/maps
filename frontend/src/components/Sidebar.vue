<template>
    <div class="sidebar">
        <div class="sidebar-header">
            <h1 class="app-title">Gestion Frigos</h1>
        </div>

        <div class="sidebar-content">
            <!-- Section Livreurs -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">
                        Livreurs disponibles ({{ selectedDriversCount }}/{{
                            drivers.length
                        }})
                    </h2>
                    <button @click="showAddDriverModal = true" class="btn-add">
                        +
                    </button>
                </div>
                <div class="drivers-list">
                    <div
                        v-for="driver in drivers"
                        :key="driver.id"
                        class="driver-item"
                        :class="{
                            unavailable: !driver.available,
                            selected: driver.selected,
                        }"
                        @click="toggleDriver(driver)"
                    >
                        <div
                            class="driver-checkbox"
                            :class="{
                                checked: driver.selected && driver.available,
                            }"
                        >
                            <span v-if="driver.selected && driver.available"
                                >✓</span
                            >
                        </div>
                        <div class="driver-info">
                            <div class="driver-name">{{ driver.name }}</div>
                            <div class="driver-status">
                                {{ getDriverStatus(driver) }}
                            </div>
                        </div>
                        <div
                            v-if="driver.routeColor"
                            class="route-color-indicator"
                            :style="{ backgroundColor: driver.routeColor }"
                        ></div>
                        <div v-if="driver.assignedCount" class="badge">
                            {{ driver.assignedCount }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Frigos -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">État des frigos</h2>
                    <button @click="showAddFridgeModal = true" class="btn-add">
                        +
                    </button>
                </div>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-dot green"></div>
                        <span class="stat-label">OK</span>
                        <span class="stat-value">{{ greenCount }}</span>
                    </div>
                    <div class="stat-item">
                        <div class="stat-dot yellow"></div>
                        <span class="stat-label">Attention</span>
                        <span class="stat-value">{{ yellowCount }}</span>
                    </div>
                    <div class="stat-item urgent">
                        <div class="stat-dot red"></div>
                        <span class="stat-label">Urgent</span>
                        <span class="stat-value">{{ redCount }}</span>
                    </div>
                </div>

                <div class="fridges-list">
                    <div
                        v-for="fridge in sortedFridges"
                        :key="fridge.id"
                        class="fridge-item"
                        @click="selectFridge(fridge)"
                    >
                        <div class="fridge-dot" :class="fridge.status"></div>
                        <div class="fridge-info">
                            <div class="fridge-name">{{ fridge.name }}</div>
                            <div class="fridge-address">
                                {{ fridge.address }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bouton d'action fixe en bas -->
        <div class="sidebar-footer">
            <button
                @click="generateRoutes"
                class="btn-generate"
                :disabled="redCount === 0 || selectedDriversCount === 0"
            >
                <span class="btn-icon">📍</span>
                <span>Générer les itinéraires</span>
                <span class="btn-count">{{ redCount }}</span>
            </button>
        </div>

        <!-- Modal ajout livreur -->
        <div
            v-if="showAddDriverModal"
            class="modal-overlay"
            @click.self="showAddDriverModal = false"
        >
            <div class="modal-content">
                <h3 class="modal-title">Ajouter un livreur</h3>
                <form @submit.prevent="addDriver">
                    <div class="form-group">
                        <label>Nom du livreur</label>
                        <input
                            v-model="newDriver.name"
                            type="text"
                            placeholder="Jean Dupont"
                            required
                        />
                    </div>
                    <div class="form-actions">
                        <button
                            type="button"
                            @click="showAddDriverModal = false"
                            class="btn-cancel"
                        >
                            Annuler
                        </button>
                        <button type="submit" class="btn-submit">
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal ajout frigo -->
        <div
            v-if="showAddFridgeModal"
            class="modal-overlay"
            @click.self="showAddFridgeModal = false"
        >
            <div class="modal-content">
                <h3 class="modal-title">Ajouter un frigo</h3>
                <form @submit.prevent="addFridge">
                    <div class="form-group">
                        <label>Nom du frigo</label>
                        <input
                            v-model="newFridge.name"
                            type="text"
                            placeholder="Frigo Centre-ville"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label>Adresse</label>
                        <input
                            v-model="newFridge.address"
                            type="text"
                            placeholder="123 Rue de la Paix"
                            required
                        />
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Latitude</label>
                            <input
                                v-model.number="newFridge.lat"
                                type="number"
                                step="0.0001"
                                placeholder="50.6292"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label>Longitude</label>
                            <input
                                v-model.number="newFridge.lng"
                                type="number"
                                step="0.0001"
                                placeholder="3.0573"
                                required
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>État</label>
                        <select v-model="newFridge.status" required>
                            <option value="green">OK</option>
                            <option value="yellow">Attention</option>
                            <option value="red">Urgent</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button
                            type="button"
                            @click="showAddFridgeModal = false"
                            class="btn-cancel"
                        >
                            Annuler
                        </button>
                        <button type="submit" class="btn-submit">
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    drivers: Array,
    fridges: Array,
});

const emit = defineEmits([
    "generate-routes",
    "toggle-driver",
    "select-fridge",
    "add-driver",
    "add-fridge",
]);

const showAddDriverModal = ref(false);
const showAddFridgeModal = ref(false);

const newDriver = ref({
    name: "",
});

const newFridge = ref({
    name: "",
    address: "",
    lat: 50.6292,
    lng: 3.0573,
    status: "green",
});

const selectedDriversCount = computed(
    () => props.drivers.filter((d) => d.available && d.selected).length
);

const greenCount = computed(
    () => props.fridges.filter((f) => f.status === "green").length
);

const yellowCount = computed(
    () => props.fridges.filter((f) => f.status === "yellow").length
);

const redCount = computed(
    () => props.fridges.filter((f) => f.status === "red").length
);

const sortedFridges = computed(() => {
    const statusOrder = { red: 0, yellow: 1, green: 2 };
    return [...props.fridges].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
    );
});

function toggleDriver(driver) {
    if (driver.available) {
        emit("toggle-driver", driver.id);
    }
}

function getDriverStatus(driver) {
    if (!driver.available) return "En livraison";
    return driver.selected ? "Sélectionné" : "Disponible";
}

function selectFridge(fridge) {
    emit("select-fridge", fridge);
}

function generateRoutes() {
    emit("generate-routes");
}

function addDriver() {
    emit("add-driver", { ...newDriver.value });
    newDriver.value = { name: "" };
    showAddDriverModal.value = false;
}

function addFridge() {
    emit("add-fridge", { ...newFridge.value });
    newFridge.value = {
        name: "",
        address: "",
        lat: 50.6292,
        lng: 3.0573,
        status: "green",
    };
    showAddFridgeModal.value = false;
}
</script>

<style scoped>
.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 350px;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.sidebar-header {
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
}

.app-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.section {
    margin-bottom: 32px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
}

.btn-add {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #3b82f6;
    color: white;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    line-height: 1;
    padding: 0;
}

.btn-add:hover {
    background: #2563eb;
    transform: scale(1.1);
}

/* Livreurs */
.drivers-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.driver-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.driver-item:hover:not(.unavailable) {
    border-color: #3b82f6;
    background: #eff6ff;
}

.driver-item.selected {
    border-color: #3b82f6;
    background: #eff6ff;
}

.driver-item.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
}

.driver-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
    flex-shrink: 0;
    transition: all 0.2s;
}

.driver-checkbox.checked {
    background: #3b82f6;
    border-color: #3b82f6;
}

.driver-info {
    flex: 1;
    min-width: 0;
}

.driver-name {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 2px;
}

.driver-status {
    font-size: 12px;
    color: #6b7280;
}

.route-color-indicator {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge {
    background: #3b82f6;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;
    min-width: 24px;
    text-align: center;
}

/* Stats */
.stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
}

.stat-item.urgent {
    background: #fef2f2;
}

.stat-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

.stat-dot.green {
    background: #10b981;
}

.stat-dot.yellow {
    background: #f59e0b;
}

.stat-dot.red {
    background: #ef4444;
}

.stat-label {
    flex: 1;
    font-size: 14px;
    color: #374151;
}

.stat-value {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
}

/* Frigos */
.fridges-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 300px;
    overflow-y: auto;
}

.fridge-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.fridge-item:hover {
    background: #f9fafb;
}

.fridge-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.fridge-dot.green {
    background: #10b981;
}

.fridge-dot.yellow {
    background: #f59e0b;
}

.fridge-dot.red {
    background: #ef4444;
}

.fridge-info {
    flex: 1;
    min-width: 0;
}

.fridge-name {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.fridge-address {
    font-size: 11px;
    color: #9ca3af;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Footer */
.sidebar-footer {
    padding: 20px;
    border-top: 1px solid #e5e7eb;
    background: white;
}

.btn-generate {
    width: 100%;
    padding: 14px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-generate:hover:not(:disabled) {
    background: #2563eb;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.btn-generate:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
}

.btn-icon {
    font-size: 18px;
}

.btn-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
}

/* Scrollbar */
.sidebar-content::-webkit-scrollbar,
.fridges-list::-webkit-scrollbar {
    width: 6px;
}

.sidebar-content::-webkit-scrollbar-track,
.fridges-list::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb,
.fridges-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover,
.fridges-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Modals */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 32px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 24px 0;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    transition: border-color 0.2s;
    background: white !important;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #3b82f6;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.btn-cancel,
.btn-submit {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel {
    background: #f3f4f6;
    color: #6b7280;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-submit {
    background: #3b82f6;
    color: white;
}

.btn-submit:hover {
    background: #2563eb;
}
</style>
