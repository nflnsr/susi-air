<template>
  <section id="documents" class="panel documents-panel">
    <div class="panel-header">
      <div>
        <p class="eyebrow">Compliance</p>
        <h2>Documents</h2>
      </div>
      <button class="text-button">View all <span>→</span></button>
    </div>
    <div class="document-list">
      <p v-if="documents.length === 0" class="muted document-empty">No documents available.</p>
      <div v-for="document in documents" :key="document.id" class="document-row">
        <div class="document-status" :class="document.status"><span></span></div>
        <div class="document-info">
          <strong>{{ document.label }}</strong
          ><span>Expires {{ formatDate(document.expiryDate) }}</span>
        </div>
        <span class="status-label" :class="document.status">{{ document.statusLabel }}</span>
      </div>
    </div>
    <div class="document-note">
      <span>!</span>
      <p>Keep your documents up to date to stay flight-ready.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Document } from "~/types/dashboard";
defineProps<{ documents: (Document & { status: string; statusLabel: string })[] }>();
function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
