import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Stack,
  Button,
} from "@mui/material";
import {
  RecruitmentRecord,
  CreateRecruitmentRecordDto,
  UpdateRecruitmentRecordDto,
  RecruitmentStatus,
  JobLevel,
} from "../../types/Recruitment";
import recruitmentService from "../../services/recruitmentService";

interface RecruitmentFormProps {
  recruitmentRecord?: RecruitmentRecord;
  onSubmit: () => void;
  onCancel: () => void;
}

type FormValues = {
  positionTitle: string;
  jobLevel: JobLevel;
  department: string;
  requestedBy: string;
  hiringManagerId: number;
  numberOfOpenings: number;
  openDate: string;
  postingDate: string;
  closeDate: string;
  status: RecruitmentStatus;
  notes: string;
};

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({
  recruitmentRecord,
  onSubmit,
  onCancel,
}) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      positionTitle: "",
      jobLevel: JobLevel.Junior,
      department: "",
      requestedBy: "",
      hiringManagerId: 0,
      numberOfOpenings: 1,
      openDate: "",
      postingDate: "",
      closeDate: "",
      status: RecruitmentStatus.Open,
      notes: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (recruitmentRecord) {
      reset({
        positionTitle: recruitmentRecord.positionTitle,
        jobLevel: recruitmentRecord.jobLevel,
        department: recruitmentRecord.department,
        requestedBy: recruitmentRecord.requestedBy,
        hiringManagerId: recruitmentRecord.hiringManagerId,
        numberOfOpenings: recruitmentRecord.numberOfOpenings,
        openDate: recruitmentRecord.openDate
          ? new Date(recruitmentRecord.openDate).toISOString().split("T")[0]
          : "",
        postingDate: recruitmentRecord.postingDate
          ? new Date(recruitmentRecord.postingDate).toISOString().split("T")[0]
          : "",
        closeDate: recruitmentRecord.closeDate
          ? new Date(recruitmentRecord.closeDate).toISOString().split("T")[0]
          : "",
        status: recruitmentRecord.status,
        notes: recruitmentRecord.notes || "",
      });
    }
  }, [recruitmentRecord, reset]);

  const onSubmitForm = async (values: FormValues) => {
    setLoading(true);
    setError("");
    try {
      if (recruitmentRecord) {
        const updateDto: UpdateRecruitmentRecordDto = {
          positionTitle: values.positionTitle,
          jobLevel: values.jobLevel,
          department: values.department,
          requestedBy: values.requestedBy,
          hiringManagerId: values.hiringManagerId,
          numberOfOpenings: values.numberOfOpenings,
          openDate: values.openDate ? `${values.openDate}T00:00:00` : "",
          postingDate: values.postingDate
            ? `${values.postingDate}T00:00:00`
            : "",
          closeDate: values.closeDate ? `${values.closeDate}T23:59:59` : "",
          status: values.status,
          notes: values.notes,
        };
        await recruitmentService.updateRecruitmentRecord(
          recruitmentRecord.id,
          updateDto,
        );
      } else {
        const createDto: CreateRecruitmentRecordDto = {
          positionTitle: values.positionTitle,
          jobLevel: values.jobLevel,
          department: values.department,
          requestedBy: values.requestedBy,
          hiringManagerId: values.hiringManagerId,
          numberOfOpenings: values.numberOfOpenings,
          openDate: values.openDate ? `${values.openDate}T00:00:00` : "",
          postingDate: values.postingDate
            ? `${values.postingDate}T00:00:00`
            : "",
          closeDate: values.closeDate ? `${values.closeDate}T23:59:59` : "",
          status: values.status,
          notes: values.notes,
        };
        await recruitmentService.createRecruitmentRecord(createDto);
      }
      onSubmit();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save recruitment record",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ pt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        <Controller
          name="positionTitle"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Position Title"
              fullWidth
              required
              placeholder="e.g., Software Engineer"
            />
          )}
        />

        <Controller
          name="jobLevel"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth required>
              <InputLabel id="job-level-label">Job Level</InputLabel>
              <Select {...field} labelId="job-level-label" label="Job Level">
                <MenuItem value={JobLevel.Junior}>Junior</MenuItem>
                <MenuItem value={JobLevel.Mid}>Mid</MenuItem>
                <MenuItem value={JobLevel.Senior}>Senior</MenuItem>
                <MenuItem value={JobLevel.Lead}>Lead</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="department"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Department"
              fullWidth
              required
              placeholder="e.g., Engineering"
            />
          )}
        />

        <Controller
          name="requestedBy"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Requested By"
              fullWidth
              required
              placeholder="e.g., John Doe"
            />
          )}
        />

        <Controller
          name="hiringManagerId"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Hiring Manager ID"
              fullWidth
              inputProps={{ min: 1 }}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).valueAsNumber)
              }
              required
            />
          )}
        />

        <Controller
          name="numberOfOpenings"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Number of Openings"
              fullWidth
              inputProps={{ min: 1 }}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).valueAsNumber)
              }
              required
            />
          )}
        />

        <Controller
          name="openDate"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="Open Date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="postingDate"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="Posting Date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="closeDate"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="Close Date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth required>
              <InputLabel id="status-label">Status</InputLabel>
              <Select {...field} labelId="status-label" label="Status">
                <MenuItem value={RecruitmentStatus.Open}>Open</MenuItem>
                <MenuItem value={RecruitmentStatus.InProgress}>
                  In Progress
                </MenuItem>
                <MenuItem value={RecruitmentStatus.Closed}>Closed</MenuItem>
                <MenuItem value={RecruitmentStatus.Cancelled}>
                  Cancelled
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="notes"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Notes"
              fullWidth
              multiline
              rows={3}
              required
              placeholder="Additional notes about this recruitment..."
            />
          )}
        />
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
      >
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Saving..." : recruitmentRecord ? "Update" : "Create"}
        </Button>
      </Stack>
    </Box>
  );
};

export default RecruitmentForm;
