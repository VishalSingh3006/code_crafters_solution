import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { projectsService } from "../services/projectsService";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types";

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  return await projectsService.getAll();
});

export const createProject = createAsyncThunk(
  "projects/create",
  async (payload: CreateProjectRequest) => {
    return await projectsService.create(payload);
  },
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, payload }: { id: number; payload: UpdateProjectRequest }) => {
    return await projectsService.update(id, payload);
  },
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: number) => {
    await projectsService.delete(id);
    return id;
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch projects";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
