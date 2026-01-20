# Planning Guide

A comprehensive advertising optimization platform featuring onboarding journey, scope selection, configuration management, dayparting analytics, campaign creation automation, and AI-powered decision monitoring for e-commerce campaigns.

**Experience Qualities**: 
1. **Professional** - Conveys expertise and trustworthiness with precise typography, clear information hierarchy, and step-by-step guidance suitable for business decisions
2. **Efficient** - Streamlines complex configuration tasks through intelligent onboarding, tabbed navigation, collapsible sections, and minimal cognitive load
3. **Transparent** - Provides complete visibility into AI-driven decisions and configuration scope with detailed indicators and actionable insights

**Complexity Level**: Light Application (multiple features with basic state)
A multi-step onboarding flow followed by a multi-tab configuration and monitoring interface with interactive form controls, data tables, visualizations, and navigation organized across four main sections: Store Settings, Dayparting, Campaign Creation, and AI Decisions.

## Essential Features

### Onboarding Journey
- **Functionality**: Two-step modal onboarding process for initial configuration
- **Purpose**: Guides new users through critical decisions before accessing the main application
- **Trigger**: Automatically displays on first visit or when user clicks "Edit Configuration"
- **Progression**: Welcome → Step 1 (Management Selection) → Step 2 (Scope Selection) → Complete → Main App
- **Success criteria**: User completes both steps, selections persist, main app reflects chosen configuration

#### Management Type Selection (Step 1)
- **Functionality**: Choice between Eva AI automated management or manual configuration
- **Purpose**: Sets the default optimization approach for all campaign aspects
- **Trigger**: User arrives at onboarding
- **Progression**: User views two cards → Selects management type → Continues to scope selection
- **Success criteria**: Selected card shows visual emphasis, Eva AI option shows as recommended with benefits listed

#### Campaign Scope Selection (Step 2)
- **Functionality**: Multi-select interface for choosing which campaign types to apply configurations to
- **Purpose**: Allows users to target specific campaign categories (Sponsored Products variations, Sponsored Brands, Sponsored Display)
- **Trigger**: User completes Step 1 and clicks Continue
- **Progression**: User views 5 scope options → Selects one or more (or all) → Sees count indicator → Completes onboarding
- **Success criteria**: Selected scopes show checkmarks and visual emphasis, "Select All" toggle works, continue button shows selected count

### Tab Navigation System
- **Functionality**: Four-tab navigation between Store Settings, Dayparting, Campaign Creation, and AI Decisions
- **Purpose**: Organizes the application into logical sections while maintaining context and state
- **Trigger**: User clicks on any tab label
- **Progression**: User views tabs → Clicks desired tab → Active indicator moves → New content loads → Previous tab state preserved
- **Success criteria**: Active tab shows purple underline, smooth transitions, content updates without page reload

### Header Configuration Indicators
- **Functionality**: Badges displaying management type and active scope count
- **Purpose**: Provides persistent visibility into current configuration
- **Trigger**: Displays automatically after onboarding completion
- **Progression**: Always visible → Shows Eva AI badge if applicable → Shows scope count → Edit button allows reconfiguration
- **Success criteria**: Badges update based on configuration, Edit button reopens onboarding

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
- **Functionality**: Three collapsible sections (Daily Bidding, Negation, Inventory & Performance Guard) with optimization controls and priority management
- **Purpose**: Configures automated optimization behaviors while reducing visual clutter, ordered by typical importance
- **Trigger**: User clicks section header to expand/collapse or clicks "Add Optimization" button
- **Progression**: User clicks header → Section expands → Table of optimizations shown → User can add/remove/reorder → Section can collapse
- **Success criteria**: Smooth accordion-style expansion, caret icon rotates to indicate state, optimizations display with priority controls, selections persist when collapsed

#### Eva AI Integration in Step 4
- **Functionality**: Visual indicator and modified messaging when Eva AI management is active
- **Purpose**: Reminds users that AI is handling optimizations while allowing overrides
- **Trigger**: Displays when management type is set to Eva AI
- **Progression**: Badge shows "Eva AI Active" → Description explains override capability → User can still add custom rules
- **Success criteria**: Eva AI badge visible, messaging clarifies that custom rules can override AI decisions

### Dayparting Analytics (Tab 2)
- **Functionality**: Heat map visualization showing campaign performance by day and hour
- **Purpose**: Helps users identify optimal bidding times across the week
- **Trigger**: User navigates to Dayparting tab
- **Progression**: User views heatmap → Selects metric filter → Analyzes patterns → Can create dayparting rules
- **Success criteria**: 24x7 grid displays with color intensity showing performance, metric filters work, "Create Rule" button accessible

#### Metric Selection
- **Functionality**: Button group for filtering heatmap by different metrics (Impressions, Clicks, Sales, Cost, CTR, CVR, ACoS)
- **Purpose**: Allows analysis of different performance dimensions
- **Trigger**: User clicks metric button
- **Progression**: User selects metric → Heatmap updates → Color intensity reflects selected metric values
- **Success criteria**: Active metric button shows primary styling, heatmap transitions smoothly

### Campaign Creation (Tab 3)
- **Functionality**: Dedicated interface for managing campaign creation automation rules
- **Purpose**: Centralizes all campaign launching logic separate from other optimizations
- **Trigger**: User navigates to Campaign Creation tab
- **Progression**: User views creation rules → Adds new rules via dropdown → Configures conditions → Rules display in table
- **Success criteria**: Clear table of creation rules, add optimization dropdown works, rules can be prioritized and deleted

#### Creation Rule Management
- **Functionality**: Table with priority controls similar to other optimization sections
- **Purpose**: Allows users to define when new campaigns should be automatically created
- **Trigger**: User clicks "Add Optimization" and selects option
- **Progression**: User adds rule → Table updates → Rules show with priority numbers → User can reorder via arrows
- **Success criteria**: Same UX pattern as Store Settings optimizations for consistency

### AI Decisions Monitoring (Tab 4)

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
- **Incomplete Onboarding**: Prevent app access until both onboarding steps complete
- **No Scopes Selected**: Disable continue button on Step 2 until at least one scope is chosen
- **Eva AI with Custom Rules**: Allow custom rules to override AI decisions, show clear indicators
- **Empty Input Fields**: Validate numeric inputs and show error states for invalid bid ranges
- **Out of Range Bids**: Warn when min bid exceeds max bid or values are unreasonably high/low
- **No Selection Made**: Disable save until required fields (focus strategy, target type) are selected
- **Recommendation Click**: Clicking recommended values should populate the corresponding input field
- **Tab Switching with Unsaved Changes**: Settings auto-save or maintain state when switching tabs
- **Empty Optimization Tables**: Show helpful empty states with call-to-action to add first rule
- **Large Data Tables**: Implement pagination and horizontal scroll for many decision records
- **Heatmap Interaction**: Hover states show detailed metrics for specific time slots
- **Dialog State**: Preserve partially completed custom optimization when dialog is cancelled (or clear on cancel with warning)
- **Reconfiguration**: Reopening onboarding maintains current selections as defaults for editing

## Design Direction
The design should evoke confidence, control, and clarity - feelings essential for users making business-critical advertising decisions. The onboarding journey should feel guided yet empowering with clear choices. The step-by-step guidance in Store Settings should feel approachable yet professional. The heatmap visualization should be immediately intuitive with color intensity conveying performance. The interface should feel like a premium software tool with sophisticated dark aesthetics reminiscent of modern financial or analytics platforms.

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
  - Dialog for onboarding modal (two-step process with progress indicator)
  - Tabs for main navigation (Store Settings, Dayparting, Campaign Creation, AI Decisions) with custom styling
  - Badge for management type indicator, scope count, optimization status, and campaign tags
  - RadioGroup for focus strategy, target type, and onboarding management selection
  - Input for bid amounts and target percentage
  - Select for optimization dropdowns and condition builders
  - Collapsible/Accordion for optimization sections to reduce visual complexity
  - Table for displaying AI decision data and optimization rules with priority controls
  - Button for navigation, actions (Clear, Save, Add Optimization, Create Rule, Revert), and onboarding flow
  - Card for onboarding options, left sidebar, main content panel, and dayparting legend
  - Separator for dividing sections
  - Checkbox for scope selection in onboarding
  - Popover for "Add Optimization" dropdown menu with three options
- **Customizations**: 
  - Dialog requires hide-close button styling for onboarding (prevent dismissal)
  - Onboarding cards need larger size with hover states and selected emphasis
  - Scope selection cards with custom checkbox styling integrated into card
  - Tabs require custom borderless styling with bottom border active indicator
  - Radio buttons need custom violet selection state with highlighted container for active option
  - Inputs require dark theme styling with violet focus rings
  - Heatmap grid requires custom color gradient based on performance intensity
  - Badge needs multiple variants (Eva AI indicator, scope counter, optimization status)
  - Collapsible headers need hover states and rotating caret icons
  - Table rows need priority control arrows inline with row numbers
  - Dialog needs max-width increase for complex condition builder
- **States**: 
  - Onboarding cards: default/hover/selected (with border and background emphasis)
  - Scope checkboxes: unchecked/checked (integrated into card visual state)
  - Buttons: default/hover (darker violet)/active (scale down)/disabled (low opacity)
  - Inputs: default/hover (brighter border)/focus (violet ring)/filled
  - Radio: unchecked/checked (violet)/hover (border highlight)
  - Heatmap cells: default/hover (overlay with metric detail)/selected
  - Collapsible: collapsed/expanded (with rotating caret)
  - Table rows: default/hover (light muted background)
  - Tabs: inactive (muted text)/active (primary color + border)
  - Priority arrows: default/hover/disabled (when at list boundary)
- **Icon Selection**: Phosphor Icons for:
  - Sparkle (Eva AI indicator)
  - Home (navigation)
  - Info (tooltips)
  - Caret Down/Up (collapsibles and priority controls)
  - Plus (add actions)
  - Trash (delete actions)
  - Cursor Click (recommendation indicators)
  - Check (onboarding progress and scope selection)
  - X (dialog close)
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
