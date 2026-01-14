import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import { ArrowLeft, CheckCircle, Save, ArrowRight, Users, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  ageGroup: string;
  isEditing: boolean;
  isSelected: boolean;
}

const generateStudentId = (classLevel: string, section: string, index: number): string => {
  const prefix = "K";
  const paddedIndex = String(index).padStart(3, "0");
  return `${prefix}_${classLevel}_${section}${paddedIndex}`;
};

const BulkUploadPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const data = location.state?.students;
    if (!data || data.length === 0) {
      toast.error("No student data found");
      navigate("/student-info");
      return;
    }

    // Convert parsed data to student rows
    const rows: StudentRow[] = data.map((s: any, index: number) => ({
      id: generateStudentId(s.class, s.section || "A", index + 1),
      name: s.name,
      email: s.email,
      phone: s.phone || "",
      class: s.class,
      section: s.section || "A",
      ageGroup: s.ageGroup || "15-18",
      isEditing: false,
      isSelected: false,
    }));

    setStudents(rows);
  }, [location.state, navigate]);

  const handleFieldChange = (index: number, field: keyof StudentRow, value: string) => {
    setStudents(prev => prev.map((s, i) => 
      i === index ? { ...s, [field]: value } : s
    ));
  };

  const toggleEdit = (index: number) => {
    setStudents(prev => prev.map((s, i) => 
      i === index ? { ...s, isEditing: !s.isEditing } : s
    ));
  };

  const toggleSelect = (index: number) => {
    setStudents(prev => {
      const updated = prev.map((s, i) => 
        i === index ? { ...s, isSelected: !s.isSelected } : s
      );
      setSelectAll(updated.every(s => s.isSelected));
      return updated;
    });
  };

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setStudents(prev => prev.map(s => ({ ...s, isSelected: newValue })));
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSaveAll = async () => {
    // Validate all rows
    const errors: string[] = [];
    students.forEach((s, i) => {
      if (!s.name.trim()) errors.push(`Row ${i + 1}: Name is required`);
      if (!s.email.trim()) errors.push(`Row ${i + 1}: Email is required`);
      else if (!validateEmail(s.email)) errors.push(`Row ${i + 1}: Invalid email format`);
      if (!s.class) errors.push(`Row ${i + 1}: Class is required`);
    });

    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setIsSaving(true);

    try {
      const insertData = students.map(s => ({
        student_id: s.id,
        name: s.name.trim(),
        email: s.email.trim(),
        phone: s.phone.trim() || null,
        class: s.class,
        section: s.section,
        age_group: s.ageGroup,
      }));

      const { error } = await supabase.from("students").insert(insertData);

      if (error) throw error;

      toast.success(`${students.length} students saved successfully!`);
      navigate("/student-info");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save students");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceed = () => {
    const selected = students.filter(s => s.isSelected);
    if (selected.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    // Store selected students for the career visualizer
    sessionStorage.setItem("selectedStudents", JSON.stringify(selected));
    toast.success(`Proceeding with ${selected.length} student(s)`);
    navigate("/career-visualization");
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <Logo size="md" />
        <Link to="/student-info">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={18} />
            ← Back to List
          </Button>
        </Link>
      </nav>

      <main className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            <span className="neon-text">Review & Edit</span> {students.length} Students
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Click on any cell to edit. All changes are validated in real-time.
          </p>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden animate-fadeIn mb-6" style={{ animationDelay: "0.1s" }}>
          <div className="overflow-x-auto max-h-[60vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-card/95 backdrop-blur z-10">
                <TableRow className="border-b border-border/50">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectAll} 
                      onCheckedChange={handleSelectAll}
                      className="border-primary"
                    />
                  </TableHead>
                  <TableHead className="text-primary font-display">ID</TableHead>
                  <TableHead className="text-primary font-display">Full Name</TableHead>
                  <TableHead className="text-primary font-display">Email</TableHead>
                  <TableHead className="text-primary font-display">Phone</TableHead>
                  <TableHead className="text-primary font-display">Class</TableHead>
                  <TableHead className="text-primary font-display">Section</TableHead>
                  <TableHead className="text-primary font-display">Age Group</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow 
                    key={student.id}
                    className={`
                      transition-colors
                      ${index % 2 === 0 ? "bg-muted/5" : "bg-muted/10"}
                      ${student.isSelected ? "bg-primary/10" : ""}
                      hover:bg-primary/5
                    `}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={student.isSelected}
                        onCheckedChange={() => toggleSelect(index)}
                        className="border-primary"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {student.id}
                    </TableCell>
                    <TableCell>
                      {student.isEditing ? (
                        <Input
                          value={student.name}
                          onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                          className="h-8 bg-muted/30 border-primary/50 focus:border-primary"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{student.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.isEditing ? (
                        <Input
                          value={student.email}
                          onChange={(e) => handleFieldChange(index, "email", e.target.value)}
                          className={`h-8 bg-muted/30 ${
                            validateEmail(student.email) ? "border-border/50" : "border-destructive"
                          }`}
                        />
                      ) : (
                        <span className={!validateEmail(student.email) ? "text-destructive" : ""}>
                          {student.email}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.isEditing ? (
                        <Input
                          value={student.phone}
                          onChange={(e) => handleFieldChange(index, "phone", e.target.value)}
                          className="h-8 bg-muted/30 border-border/50"
                          placeholder="+91..."
                        />
                      ) : (
                        <span className="text-muted-foreground">{student.phone || "-"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.isEditing ? (
                        <Select 
                          value={student.class} 
                          onValueChange={(v) => handleFieldChange(index, "class", v)}
                        >
                          <SelectTrigger className="h-8 w-20 bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["6", "7", "8", "9", "10", "11", "12"].map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="badge-neon text-xs">{student.class}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.isEditing ? (
                        <Select 
                          value={student.section} 
                          onValueChange={(v) => handleFieldChange(index, "section", v)}
                        >
                          <SelectTrigger className="h-8 w-16 bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["A", "B", "C", "D", "E", "K"].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span>{student.section}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.isEditing ? (
                        <Select 
                          value={student.ageGroup} 
                          onValueChange={(v) => handleFieldChange(index, "ageGroup", v)}
                        >
                          <SelectTrigger className="h-8 w-32 bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10-14">10-14 Middle School</SelectItem>
                            <SelectItem value="15-18">15-18 High School</SelectItem>
                            <SelectItem value="19-24">19-24 College</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {student.ageGroup === "15-18" ? "15-18 (High School)" : student.ageGroup}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEdit(index)}
                        className={student.isEditing ? "text-primary" : "text-muted-foreground"}
                      >
                        <Edit2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Actions */}
        <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <Users size={18} className="inline mr-2" />
            {students.filter(s => s.isSelected).length} of {students.length} selected
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="neon"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="gap-2"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "✅ Save All"}
            </Button>
            <Button
              variant="hero"
              onClick={handleProceed}
              disabled={students.filter(s => s.isSelected).length === 0}
              className="gap-2"
            >
              Proceed to Career Visualizer
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulkUploadPreview;
