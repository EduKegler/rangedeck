/**
 * Google Analytics 4 Event Tracking Utility
 *
 * Centralized module for type-safe GA4 event tracking throughout the application.
 * All events follow GA4 naming conventions (lowercase_with_underscores).
 */

// Type definitions for event parameters
interface BaseEventParams {
  [key: string]: string | number | boolean | undefined;
}

interface RangeCreatedParams {
  range_name: string;
  category: string;
  method?: 'from_scratch' | 'duplicate';
}

interface RangeEditedParams {
  range_id: string;
  range_name: string;
  hand_count: number;
}

interface RangeDeletedParams {
  range_name: string;
  category: string;
  had_custom_hands: boolean;
}

interface RangeRenamedParams {
  old_name: string;
  new_name: string;
  category: string;
}

interface RangeExportedParams {
  total_ranges: number;
  total_categories: number;
  custom_ranges_count: number;
}

interface RangeImportedParams {
  ranges_count: number;
  categories_count: number;
  merge_mode?: boolean;
}

interface HandsPaintedParams {
  label_name: string;
  label_color: string;
  hands_count: number;
  action_type: 'single' | 'drag';
}

interface HandsErasedParams {
  hands_count: number;
}

interface LabelCreatedParams {
  label_name: string;
  label_color: string;
  range_name: string;
}

interface LabelDeletedParams {
  label_name: string;
  affected_hands_count: number;
}

interface LabelEditedParams {
  label_name: string;
  changed_field: 'name' | 'color' | 'both';
  range_name: string;
}

interface LabelReorderedParams {
  direction: 'up' | 'down';
  new_position: number;
  label_name: string;
}

interface LabelSelectedParams {
  label_name: string;
  label_color: string;
  range_name: string;
}

interface CategoryCreatedParams {
  category_name: string;
}

interface CategoryDeletedParams {
  category_name: string;
  ranges_count: number;
}

interface CategoryRenamedParams {
  old_name: string;
  new_name: string;
}

interface CategoryReorderedParams {
  category_name: string;
  direction: 'up' | 'down';
}

interface RangeMovedParams {
  from_category: string;
  to_category: string;
  range_name: string;
}

interface RangeReorderedParams {
  category: string;
  range_name: string;
}

interface UndoUsedParams {
  range_name: string;
  history_depth: number;
}

interface RedoUsedParams {
  range_name: string;
  history_depth: number;
}

interface SettingsChangedParams {
  setting_name: 'grid_font_size' | 'card_size';
  old_value: number;
  new_value: number;
}

interface EditorSessionStartParams {
  range_name: string;
  label_count: number;
  hands_painted_count: number;
}

interface EditorSessionEndParams {
  range_name: string;
  time_spent_seconds: number;
  changes_made: number;
}

interface CardPreviewedParams {
  range_name: string;
  category: string;
}

interface KeyboardShortcutUsedParams {
  shortcut_name: string;
  context: string;
}

interface ErrorOccurredParams {
  error_type: string;
  error_message: string;
  context: string;
}

interface ImportFailedParams {
  error_reason: string;
}

interface GridPatternDetectedParams {
  pattern_type: 'horizontal' | 'vertical' | 'diagonal' | 'block';
  range_name: string;
}

/**
 * Check if Google Analytics gtag is available
 */
function isAnalyticsAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Generic event tracking function
 * Safely sends events to Google Analytics with error handling
 */
export function trackEvent(eventName: string, params?: BaseEventParams): void {
  if (!isAnalyticsAvailable()) {
    // Silently fail in environments where gtag is not available
    // (e.g., development, ad blockers, privacy extensions)
    return;
  }

  try {
    window.gtag('event', eventName, params);
  } catch (error) {
    // Suppress errors to prevent analytics from breaking the app
    console.warn(`Analytics tracking failed for event: ${eventName}`, error);
  }
}

// ============================================================================
// HIGH PRIORITY EVENTS - Core Features
// ============================================================================

/**
 * Track when a new range is created
 */
export function trackRangeCreated(params: RangeCreatedParams): void {
  trackEvent('range_created', params);
}

/**
 * Track when a range editor is opened
 */
export function trackRangeEdited(params: RangeEditedParams): void {
  trackEvent('range_edited', params);
}

/**
 * Track when a range is deleted
 */
export function trackRangeDeleted(params: RangeDeletedParams): void {
  trackEvent('range_deleted', params);
}

/**
 * Track when a range is renamed
 */
export function trackRangeRenamed(params: RangeRenamedParams): void {
  trackEvent('range_renamed', params);
}

/**
 * Track when ranges are exported to JSON
 */
export function trackRangeExported(params: RangeExportedParams): void {
  trackEvent('range_exported', params);
}

/**
 * Track when ranges are imported from JSON
 */
export function trackRangeImported(params: RangeImportedParams): void {
  trackEvent('range_imported', params);
}

/**
 * Track when hands are painted on the poker grid
 */
export function trackHandsPainted(params: HandsPaintedParams): void {
  trackEvent('hands_painted', params);
}

/**
 * Track when hand labels are erased
 */
export function trackHandsErased(params: HandsErasedParams): void {
  trackEvent('hands_erased', params);
}

/**
 * Track when a new label is created
 */
export function trackLabelCreated(params: LabelCreatedParams): void {
  trackEvent('label_created', params);
}

/**
 * Track when a label is deleted
 */
export function trackLabelDeleted(params: LabelDeletedParams): void {
  trackEvent('label_deleted', params);
}

/**
 * Track when a label is edited
 */
export function trackLabelEdited(params: LabelEditedParams): void {
  trackEvent('label_edited', params);
}

/**
 * Track when a label's position is changed
 */
export function trackLabelReordered(params: LabelReorderedParams): void {
  trackEvent('label_reordered', params);
}

/**
 * Track when a new category is created
 */
export function trackCategoryCreated(params: CategoryCreatedParams): void {
  trackEvent('category_created', params);
}

/**
 * Track when a category is deleted
 */
export function trackCategoryDeleted(params: CategoryDeletedParams): void {
  trackEvent('category_deleted', params);
}

/**
 * Track when a category is renamed
 */
export function trackCategoryRenamed(params: CategoryRenamedParams): void {
  trackEvent('category_renamed', params);
}

// ============================================================================
// MEDIUM PRIORITY EVENTS - Engagement & Organization
// ============================================================================

/**
 * Track when a range is moved to a different category
 */
export function trackRangeMoved(params: RangeMovedParams): void {
  trackEvent('range_moved', params);
}

/**
 * Track when a range is reordered within its category
 */
export function trackRangeReordered(params: RangeReorderedParams): void {
  trackEvent('range_reordered', params);
}

/**
 * Track when a category is reordered
 */
export function trackCategoryReordered(params: CategoryReorderedParams): void {
  trackEvent('category_reordered', params);
}

/**
 * Track when undo is used in the editor
 */
export function trackUndoUsed(params: UndoUsedParams): void {
  trackEvent('undo_used', params);
}

/**
 * Track when redo is used in the editor
 */
export function trackRedoUsed(params: RedoUsedParams): void {
  trackEvent('redo_used', params);
}

/**
 * Track when a label is selected for painting
 */
export function trackLabelSelected(params: LabelSelectedParams): void {
  trackEvent('label_selected', params);
}

/**
 * Track when user settings are changed
 */
export function trackSettingsChanged(params: SettingsChangedParams): void {
  trackEvent('settings_changed', params);
}

// ============================================================================
// LOW PRIORITY EVENTS - UX Insights & Session Tracking
// ============================================================================

/**
 * Track when an editor session starts
 */
export function trackEditorSessionStart(params: EditorSessionStartParams): void {
  trackEvent('editor_session_start', params);
}

/**
 * Track when an editor session ends
 */
export function trackEditorSessionEnd(params: EditorSessionEndParams): void {
  trackEvent('editor_session_end', params);
}

/**
 * Track when a range card is previewed (on hover)
 */
export function trackCardPreviewed(params: CardPreviewedParams): void {
  trackEvent('card_previewed', params);
}

/**
 * Track when a keyboard shortcut is used
 */
export function trackKeyboardShortcutUsed(params: KeyboardShortcutUsedParams): void {
  trackEvent('keyboard_shortcut_used', params);
}

/**
 * Track when an error occurs
 */
export function trackErrorOccurred(params: ErrorOccurredParams): void {
  trackEvent('error_occurred', params);
}

/**
 * Track when import fails
 */
export function trackImportFailed(params: ImportFailedParams): void {
  trackEvent('import_failed', params);
}

/**
 * Track when a specific grid pattern is detected
 */
export function trackGridPatternDetected(params: GridPatternDetectedParams): void {
  trackEvent('grid_pattern_detected', params);
}

// ============================================================================
// Type augmentation for gtag global
// ============================================================================

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js',
      targetId: string | Date,
      params?: BaseEventParams
    ) => void;
    dataLayer: unknown[];
  }
}
