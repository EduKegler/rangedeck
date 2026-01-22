interface BaseEventParams {
  [key: string]: string | number | boolean | undefined;
}

interface RangeCreatedParams extends BaseEventParams {
  range_name: string;
  category: string;
  method?: 'from_scratch' | 'duplicate';
}

interface RangeEditedParams extends BaseEventParams {
  range_id: string;
  range_name: string;
  hand_count: number;
}

interface RangeDeletedParams extends BaseEventParams {
  range_name: string;
  category: string;
  had_custom_hands: boolean;
}

interface RangeRenamedParams extends BaseEventParams {
  old_name: string;
  new_name: string;
  category: string;
}

interface RangeExportedParams extends BaseEventParams {
  total_ranges: number;
  total_categories: number;
  custom_ranges_count: number;
}

interface RangeImportedParams extends BaseEventParams {
  ranges_count: number;
  categories_count: number;
  merge_mode?: boolean;
}

interface HandsPaintedParams extends BaseEventParams {
  label_name: string;
  label_color: string;
  hands_count: number;
  action_type: 'single' | 'drag';
}

interface HandsErasedParams extends BaseEventParams {
  hands_count: number;
}

interface LabelCreatedParams extends BaseEventParams {
  label_name: string;
  label_color: string;
  range_name: string;
}

interface LabelDeletedParams extends BaseEventParams {
  label_name: string;
  affected_hands_count: number;
}

interface LabelEditedParams extends BaseEventParams {
  label_name: string;
  changed_field: 'name' | 'color' | 'both';
  range_name: string;
}

interface LabelReorderedParams extends BaseEventParams {
  direction: 'up' | 'down';
  new_position: number;
  label_name: string;
}

interface LabelSelectedParams extends BaseEventParams {
  label_name: string;
  label_color: string;
  range_name: string;
}

interface CategoryCreatedParams extends BaseEventParams {
  category_name: string;
}

interface CategoryDeletedParams extends BaseEventParams {
  category_name: string;
  ranges_count: number;
}

interface CategoryRenamedParams extends BaseEventParams {
  old_name: string;
  new_name: string;
}

interface CategoryReorderedParams extends BaseEventParams {
  category_name: string;
  direction: 'up' | 'down';
}

interface RangeMovedParams extends BaseEventParams {
  from_category: string;
  to_category: string;
  range_name: string;
}

interface RangeReorderedParams extends BaseEventParams {
  category: string;
  range_name: string;
}

interface UndoUsedParams extends BaseEventParams {
  range_name: string;
  history_depth: number;
}

interface RedoUsedParams extends BaseEventParams {
  range_name: string;
  history_depth: number;
}

interface SettingsChangedParams extends BaseEventParams {
  setting_name: 'grid_font_size' | 'card_size';
  old_value: number;
  new_value: number;
}

interface EditorSessionStartParams extends BaseEventParams {
  range_name: string;
  label_count: number;
  hands_painted_count: number;
}

interface EditorSessionEndParams extends BaseEventParams {
  range_name: string;
  time_spent_seconds: number;
  changes_made: number;
}

interface CardPreviewedParams extends BaseEventParams {
  range_name: string;
  category: string;
}

interface KeyboardShortcutUsedParams extends BaseEventParams {
  shortcut_name: string;
  context: string;
}

interface ErrorOccurredParams extends BaseEventParams {
  error_type: string;
  error_message: string;
  context: string;
}

interface ImportFailedParams extends BaseEventParams {
  error_reason: string;
}

interface GridPatternDetectedParams extends BaseEventParams {
  pattern_type: 'horizontal' | 'vertical' | 'diagonal' | 'block';
  range_name: string;
}

interface FeedbackLinkClickedParams extends BaseEventParams {
  source: 'footer' | 'menu';
  current_page: string;
}

function isAnalyticsAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

export function trackEvent(eventName: string, params?: BaseEventParams): void {
  if (!isAnalyticsAvailable()) {
    return;
  }

  try {
    window.gtag('event', eventName, params);
  } catch (error) {
    console.warn(`Analytics tracking failed for event: ${eventName}`, error);
  }
}

export function trackRangeCreated(params: RangeCreatedParams): void {
  trackEvent('range_created', params);
}

export function trackRangeEdited(params: RangeEditedParams): void {
  trackEvent('range_edited', params);
}

export function trackRangeDeleted(params: RangeDeletedParams): void {
  trackEvent('range_deleted', params);
}

export function trackRangeRenamed(params: RangeRenamedParams): void {
  trackEvent('range_renamed', params);
}

export function trackRangeExported(params: RangeExportedParams): void {
  trackEvent('range_exported', params);
}

export function trackRangeImported(params: RangeImportedParams): void {
  trackEvent('range_imported', params);
}

export function trackHandsPainted(params: HandsPaintedParams): void {
  trackEvent('hands_painted', params);
}

export function trackHandsErased(params: HandsErasedParams): void {
  trackEvent('hands_erased', params);
}

export function trackLabelCreated(params: LabelCreatedParams): void {
  trackEvent('label_created', params);
}

export function trackLabelDeleted(params: LabelDeletedParams): void {
  trackEvent('label_deleted', params);
}

export function trackLabelEdited(params: LabelEditedParams): void {
  trackEvent('label_edited', params);
}

export function trackLabelReordered(params: LabelReorderedParams): void {
  trackEvent('label_reordered', params);
}

export function trackCategoryCreated(params: CategoryCreatedParams): void {
  trackEvent('category_created', params);
}

export function trackCategoryDeleted(params: CategoryDeletedParams): void {
  trackEvent('category_deleted', params);
}

export function trackCategoryRenamed(params: CategoryRenamedParams): void {
  trackEvent('category_renamed', params);
}

export function trackRangeMoved(params: RangeMovedParams): void {
  trackEvent('range_moved', params);
}

export function trackRangeReordered(params: RangeReorderedParams): void {
  trackEvent('range_reordered', params);
}

export function trackCategoryReordered(params: CategoryReorderedParams): void {
  trackEvent('category_reordered', params);
}

export function trackUndoUsed(params: UndoUsedParams): void {
  trackEvent('undo_used', params);
}

export function trackRedoUsed(params: RedoUsedParams): void {
  trackEvent('redo_used', params);
}

export function trackLabelSelected(params: LabelSelectedParams): void {
  trackEvent('label_selected', params);
}

export function trackSettingsChanged(params: SettingsChangedParams): void {
  trackEvent('settings_changed', params);
}

export function trackEditorSessionStart(params: EditorSessionStartParams): void {
  trackEvent('editor_session_start', params);
}

export function trackEditorSessionEnd(params: EditorSessionEndParams): void {
  trackEvent('editor_session_end', params);
}

export function trackCardPreviewed(params: CardPreviewedParams): void {
  trackEvent('card_previewed', params);
}

export function trackKeyboardShortcutUsed(params: KeyboardShortcutUsedParams): void {
  trackEvent('keyboard_shortcut_used', params);
}

export function trackErrorOccurred(params: ErrorOccurredParams): void {
  trackEvent('error_occurred', params);
}

export function trackImportFailed(params: ImportFailedParams): void {
  trackEvent('import_failed', params);
}

export function trackGridPatternDetected(params: GridPatternDetectedParams): void {
  trackEvent('grid_pattern_detected', params);
}

export function trackFeedbackLinkClicked(params: FeedbackLinkClickedParams): void {
  trackEvent('feedback_link_clicked', params);
}

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
