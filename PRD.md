# Planning Guide

A comprehensive advertising optimization platform featuring configuration management, goal tracking, and AI-powered decision monitoring for e-commerce campaigns.

**Experience Qualities**: 
1. **Professional** - Conveys expertise and trustworthiness with precise typography, clear information hierarchy, and step-by-step guidance suitable for business decisions
2. **Efficient** - Streamlines complex configuration tasks through intelligent grouping, collapsible sections, and tabbed navigation with minimal cognitive load
3. **Transparent** - Provides complete visibility into AI-driven decisions with detailed tracking tables and actionable insights

**Complexity Level**: Light Application (multiple features with basic state)
A multi-tab configuration and monitoring interface with several interactive form controls, data tables, and navigation organized across three main sections: Store Settings, Goal Details, and AI Decisions.

## Essential Features

### Tab Navigation System
- **Functionality**: Three-tab navigation between Store Settings, Goal Details, and AI Decisions
- **Purpose**: Organizes the application into logical sections while maintaining context and state
- **Trigger**: User clicks on any tab label
- **Progression**: User views tabs → Clicks desired tab → Active indicator moves → New content loads → Previous tab state preserved
- **Success criteria**: Active tab shows purple underline, smooth transitions, content updates without page reload

### Store Settings Configuration (Tab 1)

#### Step-by-Step Journey
- **Functionality**: Progressive disclosure of configuration steps with clear headings and descriptions
- **Purpose**: Guides users through complex setup in an understandable sequence
- **Trigger**: User navigates to Store Settings tab
- **Progression**: Introduction text → Step 1 (Focus) → Step 2 (Target Metric) → Step 3 (Bid Boundaries) → Step 4 (Optimizations) → Save
- **Success criteria**: Each step is clearly labeled, descriptive text explains purpose, user can complete setup confidently

#### Focus Strategy Selection
- **Functionality**: Radio button group allowing selection between 5 growth/profit optimization strategies
- **Purpose**: Sets the primary business objective that influences all other optimization decisions
- **Trigger**: User clicks on any strategy option
- **Progression**: User views list → Clicks strategy → Visual highlight appears → Selection state persists
- **Success criteria**: Selected strategy shows distinct visual emphasis with background highlight and bold text

#### Target Type Configuration
- **Functionality**: Toggle between ACoS and TACoS metrics with contextual breakeven information
- **Purpose**: Defines the key performance indicator for advertising spend optimization
- **Trigger**: User selects ACoS or TACoS radio option
- **Progression**: User views options → Selects metric → Related calculations update → Breakeven reference displays
- **Success criteria**: Selected metric is visually indicated and breakeven ACoS link remains accessible

#### Bid Range Settings
- **Functionality**: Text inputs for minimum and maximum bid amounts with recommended value hints
- **Purpose**: Establishes safe bidding boundaries to prevent overspend or underperformance
- **Trigger**: User clicks into input field
- **Progression**: User focuses field → Enters value → Sees recommendation → Optionally clicks to apply recommendation
- **Success criteria**: Values are editable, recommendations are clickable and update the input

#### Target ACoS Input
- **Functionality**: Percentage input field with recommended target suggestion
- **Purpose**: Sets the goal advertising cost of sale percentage
- **Trigger**: User clicks input field
- **Progression**: User focuses field → Enters percentage → Views recommendation → Can apply suggested value
- **Success criteria**: Input accepts percentage values and displays with proper formatting

#### Collapsible Optimization Sections
- **Functionality**: Four collapsible sections (Daily Bidding, Dayparting, Campaign Creation, Negation) with dropdown selectors
- **Purpose**: Configures automated optimization behaviors while reducing visual clutter
- **Trigger**: User clicks section header to expand/collapse
- **Progression**: User clicks header → Section expands → Dropdown selector appears → User selects option → Section can collapse
- **Success criteria**: Smooth accordion-style expansion, caret icon rotates to indicate state, selections persist when collapsed

#### Custom Optimization Dialog
- **Functionality**: Modal dialog for creating custom Daily Bidding optimization rules
- **Purpose**: Allows advanced users to define complex conditional automation
- **Trigger**: User selects "Custom Optimization" from Daily Bidding dropdown
- **Progression**: User selects option → Dialog opens → User defines conditions → User sets actions → User saves → Dialog closes
- **Success criteria**: Wide modal displays condition builder and action selector, changes save and persist

### Goal Details (Tab 2)
- **Functionality**: Placeholder section for future goal management features
- **Purpose**: Reserved space for viewing and managing advertising goals
- **Trigger**: User clicks Goal Details tab
- **Progression**: User navigates to tab → Sees placeholder message
- **Success criteria**: Clear messaging that feature is coming soon

### AI Decisions Monitoring (Tab 3)

#### Decision Table Display
- **Functionality**: Comprehensive data table showing all AI-powered bid decisions, status changes, and negations
- **Purpose**: Provides complete transparency into automated actions for audit and learning
- **Trigger**: User clicks AI Decisions tab
- **Progression**: User navigates → Table loads → User can search, filter, paginate → User can view details or revert decisions
- **Success criteria**: Table displays 7+ sample decisions with all relevant columns, responsive horizontal scroll

#### Search and Filter
- **Functionality**: Search bar for campaign names and filter button for advanced criteria
- **Purpose**: Helps users find specific decisions quickly in large datasets
- **Trigger**: User types in search or clicks filter button
- **Progression**: User enters query → Table filters in real-time → Results update
- **Success criteria**: Search is responsive, filter button is accessible

#### Decision Type Tabs
- **Functionality**: Sub-tabs for Bid Decisions, Status Decisions, and Negating Decisions
- **Purpose**: Categorizes different types of AI actions for easier review
- **Trigger**: User clicks sub-tab
- **Progression**: User switches tab → Table content updates → Active indicator moves
- **Success criteria**: Smooth tab switching, active state visible

#### Bulk Actions
- **Functionality**: Checkbox selection and "Revert in Bulk" action
- **Purpose**: Allows users to undo multiple AI decisions at once
- **Trigger**: User checks rows and clicks Revert in Bulk
- **Progression**: User selects decisions → Clicks bulk action → Confirmation → Decisions revert
- **Success criteria**: Checkboxes functional, bulk button becomes enabled when selections exist

#### Row Details and Revert
- **Functionality**: Expandable row details and individual revert buttons
- **Purpose**: Lets users drill into decision context and undo individual actions
- **Trigger**: User clicks expand icon or revert button
- **Progression**: Expand: Row expands to show details; Revert: Decision undone with confirmation
- **Success criteria**: Expand icon toggles row detail, revert provides feedback

### Clear and Save Actions
- **Functionality**: Buttons to reset all inputs or persist current configuration
- **Purpose**: Allows users to start over or commit their changes
- **Trigger**: User clicks Clear Inputs or Save Goals button
- **Progression**: Clear: Click → All fields reset to defaults → Toast confirmation; Save: Click → Settings persist → Toast success
- **Success criteria**: Clear resets form, Save shows visual feedback and persists data

## Edge Case Handling
- **Empty Input Fields**: Validate numeric inputs and show error states for invalid bid ranges
- **Out of Range Bids**: Warn when min bid exceeds max bid or values are unreasonably high/low
- **No Selection Made**: Disable save until required fields (focus strategy, target type) are selected
- **Recommendation Click**: Clicking recommended values should populate the corresponding input field
- **Tab Switching with Unsaved Changes**: Settings auto-save or maintain state when switching tabs
- **Empty Search Results**: Show helpful message when search/filter returns no matches in AI Decisions table
- **Large Data Tables**: Implement pagination and horizontal scroll for many decision records
- **Checkbox Selection**: Clear all checkboxes when switching between decision type tabs
- **Dialog State**: Preserve partially completed custom optimization when dialog is cancelled (or clear on cancel with warning)

## Design Direction
The design should evoke confidence, control, and clarity - feelings essential for users making business-critical advertising decisions. The step-by-step guidance in Store Settings should feel approachable yet professional. The AI Decisions table should convey transparency and trustworthiness, showing users exactly what the system is doing on their behalf. The interface should feel like a premium software tool with sophisticated dark aesthetics reminiscent of modern financial or analytics platforms.

## Color Selection
A violet-anchored dark theme with deep navy panels creating depth and sophistication.

- **Primary Color**: Vibrant Violet `oklch(0.62 0.24 293)` - Commands attention for interactive elements and active states, communicating precision and modern tech
- **Secondary Colors**: 
  - Deep Space Background `oklch(0.12 0.01 265)` - Creates immersive dark environment
  - Slate Panel `oklch(0.18 0.02 255)` - Elevated surfaces for content cards
  - Input Surface `oklch(0.20 0.02 255)` - Slightly lighter for form fields
- **Accent Color**: Bright Violet `oklch(0.58 0.26 293)` - Hover states and emphasis for calls-to-action
- **Foreground/Background Pairings**: 
  - Background (Deep Space #111217 / oklch(0.12 0.01 265)): Light Gray text (oklch(0.88 0.01 265)) - Ratio 12.5:1 ✓
  - Panel (Slate #1f232e / oklch(0.18 0.02 255)): White text (oklch(0.98 0 0)) - Ratio 14.8:1 ✓
  - Primary (Violet / oklch(0.62 0.24 293)): White text (oklch(0.98 0 0)) - Ratio 5.2:1 ✓
  - Muted Text (oklch(0.60 0.01 265)) on Background - Ratio 6.8:1 ✓

## Font Selection
Inter's geometric precision and excellent readability at small sizes makes it ideal for data-dense configuration interfaces.

- **Typographic Hierarchy**: 
  - H1 (Page Title): Inter Semibold/24px/normal letter spacing
  - H2 (Section Headers): Inter Bold/11px/wide letter spacing/uppercase
  - H3 (Field Labels): Inter Medium/14px/normal letter spacing
  - Input Labels: Inter Medium/12px/wide letter spacing/uppercase
  - Body (Input Values): Inter Medium/14px
  - Helper Text: Inter Regular/12px
  - Button Text: Inter Semibold/14px

## Animations
Animations should be subtle and purposeful, reinforcing actions without creating delays. Use micro-interactions for state changes (100-150ms), smooth transitions for color shifts on hover (200ms), and gentle scaling feedback on button press. The violet focus ring should fade in smoothly when inputs receive focus.

## Component Selection
- **Components**: 
  - Tabs for main navigation (Store Settings, Goal Details, AI Decisions) with custom styling
  - RadioGroup for focus strategy and target type selections
  - Input for bid amounts and target percentage
  - Select for optimization dropdowns within collapsible sections
  - Collapsible/Accordion for optimization sections to reduce visual complexity
  - Table for displaying AI decision data with complex multi-column layout
  - Button for Clear Inputs (ghost variant), Save Goals (primary variant), Revert actions, filter trigger
  - Badge for campaign type indicators (SP, AI, etc.) and target type labels
  - Card for left sidebar, main content panel, and placeholder sections
  - Separator for dividing sections
  - Dialog for custom optimization builder (wider variant)
  - Checkbox for row selection in tables
- **Customizations**: 
  - Tabs require custom borderless styling with bottom border active indicator
  - Radio buttons need custom violet selection state with highlighted container for active option
  - Inputs require dark theme styling with violet focus rings
  - Selects need custom dropdown indicator icon and dark styling
  - Tab active state requires bottom border indicator
  - Table needs custom badge styling (emerald for SP/AI tags)
  - Collapsible headers need hover states and rotating caret icons
  - Dialog needs max-width increase for complex condition builder
- **States**: 
  - Buttons: default/hover (darker violet)/active (scale down)/disabled (low opacity)
  - Inputs: default/hover (brighter border)/focus (violet ring)/filled
  - Radio: unchecked/checked (violet)/hover (border highlight)
  - Dropdowns: closed/open/hover
  - Collapsible: collapsed/expanded (with rotating caret)
  - Table rows: default/hover (light muted background)/selected (checkbox checked)
  - Tabs: inactive (muted text)/active (primary color + border)
- **Icon Selection**: Phosphor Icons for info tooltips, home navigation, dropdown carets, click indicators, delete action, search, filter, calendar, revert/undo, expand/collapse, pagination
- **Spacing**: 
  - Section gaps: 24px (gap-6)
  - Form field spacing: 20px (gap-5)
  - Input internal padding: 8px 12px (px-3 py-2)
  - Card padding: 24px (p-6)
  - Grid column gap: 24px (gap-6)
  - Step sections: 12px gap between title and description
- **Mobile**: 
  - Two-column layout stacks to single column below 1024px
  - Navigation tabs remain horizontal with smaller text
  - Sub-tabs (Bid/Status/Negating Decisions) may stack or scroll horizontally
  - Table becomes horizontally scrollable with sticky first column
  - Dropdowns become full-width
  - Buttons stack vertically in footer
  - Maintain padding but reduce outer margins
  - Collapsible sections remain full-width
